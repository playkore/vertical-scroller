import Phaser from 'phaser';
import { BossSpawner } from './BossSpawner';
import { EnemySpawner } from './EnemySpawner';
import { PowerupSpawner } from './PowerupSpawner';
import { getBossById } from '../bosses/BossRegistry';
import { getEnemyById } from '../enemies/EnemyRegistry';
import {
  LevelDefinition,
  LevelWaveDefinition,
  resolveWaveLevelConfig
} from '../levels/LevelDefinition';
import { getPlayfieldBounds } from '../layout/Playfield';
import { getPowerupById } from '../powerups/PowerupRegistry';
import { CGA_HEX } from '../style/CgaPalette';

type WaveDirectorState = 'SPAWNING' | 'FIGHTING' | 'INTERWAVE' | 'DONE';

export class WaveDirector {
  private readonly levelText: Phaser.GameObjects.Text;
  private readonly statusText: Phaser.GameObjects.Text;
  private readonly waves: LevelWaveDefinition[];
  private readonly spawnRatePerSecond: number;
  private readonly interWaveDelaySeconds: number;
  private readonly totalEnemies: number;

  private currentWaveIndex = 0;
  private pendingSpawnQueue: string[] = [];
  private aliveEnemies = 0;
  private defeatedEnemies = 0;
  private spawnAccumulator = 0;
  private interwaveTimer = 0;
  private state: WaveDirectorState = 'DONE';
  private bossSpawned = false;
  private levelComplete = false;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly enemySpawner: EnemySpawner,
    private readonly bossSpawner: BossSpawner,
    private readonly powerupSpawner: PowerupSpawner,
    private readonly level: LevelDefinition
  ) {
    const bounds = getPlayfieldBounds(this.scene.scale.width, this.scene.scale.height);
    const resolved = resolveWaveLevelConfig(this.level);
    this.waves = resolved.waves;
    this.spawnRatePerSecond = resolved.waveMode.spawnRatePerSecond;
    this.interWaveDelaySeconds = resolved.waveMode.interWaveDelaySeconds;
    this.totalEnemies = resolved.totalEnemies;

    this.levelText = this.scene.add
      .text(bounds.left + 10, 28, `LEVEL ${this.level.name}`, {
        fontFamily: 'Courier New, monospace',
        fontSize: '12px',
        color: CGA_HEX.cyan
      })
      .setDepth(100)
      .setScrollFactor(0);

    this.statusText = this.scene.add
      .text(bounds.left + 10, 44, '', {
        fontFamily: 'Courier New, monospace',
        fontSize: '12px',
        color: CGA_HEX.magenta
      })
      .setDepth(100)
      .setScrollFactor(0);

    if (this.waves.length > 0) {
      this.startWave(0);
    } else {
      this.startBossOrComplete();
    }
  }

  update(deltaSeconds: number) {
    if (this.levelComplete) {
      return;
    }

    if (this.bossSpawned) {
      if (!this.bossSpawner.hasActiveBoss()) {
        this.levelComplete = true;
        this.statusText.setText('LEVEL CLEAR');
      }
      return;
    }

    if (this.state === 'SPAWNING') {
      this.updateSpawning(deltaSeconds);
      return;
    }

    if (this.state === 'INTERWAVE') {
      this.interwaveTimer = Math.max(0, this.interwaveTimer - deltaSeconds);
      this.statusText.setText(`INTER ${this.interwaveTimer.toFixed(1)}S`);

      if (this.interwaveTimer <= 0) {
        this.currentWaveIndex += 1;
        if (this.currentWaveIndex < this.waves.length) {
          this.startWave(this.currentWaveIndex);
        } else {
          this.startBossOrComplete();
        }
      }
    }
  }

  onEnemyKilled(x: number, y: number) {
    this.defeatedEnemies += 1;
    this.resolveEnemyDeparture({ x, y }, true);
  }

  onEnemyRemoved() {
    this.resolveEnemyDeparture(null, false);
  }

  isLevelComplete(): boolean {
    return this.levelComplete;
  }

  getProgressRatio(): number {
    if (this.levelComplete) {
      return 1;
    }

    const enemyRatio = this.totalEnemies > 0 ? this.defeatedEnemies / this.totalEnemies : 1;
    if (!this.level.bossId) {
      return Phaser.Math.Clamp(enemyRatio, 0, 1);
    }

    if (this.bossSpawned) {
      return 0.95;
    }

    return Phaser.Math.Clamp(enemyRatio * 0.9, 0, 0.9);
  }

  getTotalEnemies(): number {
    return this.totalEnemies;
  }

  onResize(width: number, _height: number) {
    const bounds = getPlayfieldBounds(width, this.scene.scale.height);
    this.levelText.setPosition(bounds.left + 10, 28);
    this.statusText.setPosition(bounds.left + 10, 44);
  }

  destroy() {
    this.levelText.destroy();
    this.statusText.destroy();
  }

  private updateSpawning(deltaSeconds: number) {
    this.spawnAccumulator += deltaSeconds;
    const spawnInterval = 1 / this.spawnRatePerSecond;

    while (this.spawnAccumulator >= spawnInterval && this.pendingSpawnQueue.length > 0) {
      const nextEnemyId = this.pendingSpawnQueue[0];
      const definition = getEnemyById(nextEnemyId);
      const spawned = this.enemySpawner.spawnEnemy(definition);
      if (!spawned) {
        break;
      }

      this.pendingSpawnQueue.shift();
      this.spawnAccumulator -= spawnInterval;
      this.aliveEnemies += 1;
    }

    if (this.pendingSpawnQueue.length === 0) {
      this.state = 'FIGHTING';
      this.statusText.setText(`WAVE ${this.currentWaveIndex + 1}/${this.waves.length}`);
      if (this.aliveEnemies === 0) {
        this.beginInterwave(null);
      }
    } else {
      this.statusText.setText(`SPAWN ${this.pendingSpawnQueue.length}`);
    }
  }

  private startWave(index: number) {
    const wave = this.waves[index];
    this.pendingSpawnQueue = [];

    for (const entry of wave.enemies) {
      for (let i = 0; i < entry.count; i += 1) {
        this.pendingSpawnQueue.push(entry.enemyId);
      }
    }

    Phaser.Utils.Array.Shuffle(this.pendingSpawnQueue);
    this.aliveEnemies = 0;
    this.spawnAccumulator = 0;
    this.state = 'SPAWNING';
    this.statusText.setText(`WAVE ${index + 1}/${this.waves.length}`);
  }

  private startBossOrComplete() {
    this.state = 'DONE';

    if (!this.level.bossId) {
      this.levelComplete = true;
      this.statusText.setText('LEVEL CLEAR');
      return;
    }

    this.bossSpawned = true;
    this.bossSpawner.spawnBoss(getBossById(this.level.bossId));
    this.statusText.setText('BOSS ALERT');
  }

  private resolveEnemyDeparture(
    lootPosition: { x: number; y: number } | null,
    shouldSpawnLoot: boolean
  ) {
    if (this.aliveEnemies <= 0) {
      return;
    }

    this.aliveEnemies -= 1;
    if (this.aliveEnemies > 0 || this.pendingSpawnQueue.length > 0) {
      return;
    }

    this.beginInterwave(shouldSpawnLoot ? lootPosition : null);
  }

  private beginInterwave(lootPosition: { x: number; y: number } | null) {
    if (this.state === 'INTERWAVE' || this.state === 'DONE') {
      return;
    }

    if (lootPosition) {
      this.spawnWaveLootAt(lootPosition.x, lootPosition.y);
    }

    this.state = 'INTERWAVE';
    this.interwaveTimer = this.interWaveDelaySeconds;
    this.statusText.setText(`INTER ${this.interwaveTimer.toFixed(1)}S`);
  }

  private spawnWaveLootAt(x: number, y: number) {
    const wave = this.waves[this.currentWaveIndex];
    for (const lootEntry of wave.loot ?? []) {
      const definition = getPowerupById(lootEntry.powerupId);
      for (let i = 0; i < lootEntry.count; i += 1) {
        const offsetX = lootEntry.count > 1 ? Phaser.Math.Between(-10, 10) : 0;
        this.powerupSpawner.spawnPowerup(definition, x + offsetX, y);
      }
    }
  }
}
