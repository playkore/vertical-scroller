import Phaser from 'phaser';
import { BossSpawner } from './BossSpawner';
import { EnemySpawner } from './EnemySpawner';
import { getBossById } from '../bosses/BossRegistry';
import { getEnemyById } from '../enemies/EnemyRegistry';
import { LevelDefinition, LevelPhase } from '../levels/LevelDefinition';
import { getPlayfieldBounds } from '../layout/Playfield';
import { CGA_HEX } from '../style/CgaPalette';

export class LevelDirector {
  private elapsedSeconds = 0;
  private spawnCooldown = 0;
  private bossSpawned = false;
  private levelComplete = false;

  private readonly levelText: Phaser.GameObjects.Text;
  private readonly statusText: Phaser.GameObjects.Text;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly enemySpawner: EnemySpawner,
    private readonly bossSpawner: BossSpawner,
    private readonly level: LevelDefinition
  ) {
    const bounds = getPlayfieldBounds(this.scene.scale.width, this.scene.scale.height);

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
  }

  update(deltaSeconds: number) {
    if (this.levelComplete) {
      return;
    }

    if (this.bossSpawned) {
      // Once boss is deployed, all regular wave spawning is paused.
      if (!this.bossSpawner.hasActiveBoss()) {
        this.levelComplete = true;
        this.statusText.setText('LEVEL CLEAR');
      }
      return;
    }

    this.elapsedSeconds += deltaSeconds;

    // End of wave timeline: lock waves and deploy boss once.
    if (this.elapsedSeconds >= this.level.durationSeconds) {
      this.elapsedSeconds = this.level.durationSeconds;
      this.spawnBossIfConfigured();
      return;
    }

    const phase = this.getActivePhase(this.elapsedSeconds);
    if (!phase) {
      return;
    }

    this.spawnCooldown -= deltaSeconds;
    if (this.spawnCooldown > 0) {
      return;
    }

    const enemyId = this.rollEnemyId(phase);
    const enemy = getEnemyById(enemyId);
    this.enemySpawner.spawnEnemy(enemy);

    this.spawnCooldown = Phaser.Math.FloatBetween(phase.minDelay, phase.maxDelay);
  }

  getProgressRatio(): number {
    return Phaser.Math.Clamp(this.elapsedSeconds / this.level.durationSeconds, 0, 1);
  }

  isLevelComplete(): boolean {
    return this.levelComplete;
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

  private spawnBossIfConfigured() {
    this.bossSpawned = true;

    if (!this.level.bossId) {
      this.levelComplete = true;
      this.statusText.setText('LEVEL CLEAR');
      return;
    }

    const boss = getBossById(this.level.bossId);
    this.bossSpawner.spawnBoss(boss);
    this.statusText.setText('BOSS ALERT');
  }

  private getActivePhase(elapsedSeconds: number): LevelPhase | null {
    return (
      this.level.phases.find(
        (phase) => elapsedSeconds >= phase.startAt && elapsedSeconds < phase.endAt
      ) ?? null
    );
  }

  private rollEnemyId(phase: LevelPhase): string {
    const totalWeight = phase.enemies.reduce((sum, item) => sum + item.weight, 0);
    let roll = Math.random() * totalWeight;

    for (const item of phase.enemies) {
      roll -= item.weight;
      if (roll <= 0) {
        return item.enemyId;
      }
    }

    return phase.enemies[phase.enemies.length - 1].enemyId;
  }
}
