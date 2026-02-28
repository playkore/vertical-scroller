import Phaser from 'phaser';
import { EnemySpawner } from './EnemySpawner';
import { getEnemyById } from '../enemies/EnemyRegistry';
import { LevelDefinition, LevelPhase } from '../levels/LevelDefinition';
import { getPlayfieldBounds } from '../layout/Playfield';
import { CGA_HEX } from '../style/CgaPalette';

export class LevelDirector {
  // Runtime clock that advances through the configured level timeline.
  private elapsedSeconds = 0;
  // Countdown until the next enemy roll is allowed in the active phase.
  private spawnCooldown = 0;
  private levelComplete = false;
  private enemiesSpawned = 0;

  private readonly levelText: Phaser.GameObjects.Text;
  private readonly statusText: Phaser.GameObjects.Text;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly enemySpawner: EnemySpawner,
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

  // Advances level pacing and handles phased spawns.
  update(deltaSeconds: number) {
    const durationSeconds = this.level.durationSeconds ?? 0;
    if (this.levelComplete) {
      return;
    }

    this.elapsedSeconds += deltaSeconds;

    // End of wave timeline: lock waves and finish the level.
    if (this.elapsedSeconds >= durationSeconds) {
      this.elapsedSeconds = durationSeconds;
      this.levelComplete = true;
      this.statusText.setText('LEVEL CLEAR');
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
    if (this.enemySpawner.spawnEnemy(enemy)) {
      this.enemiesSpawned += 1;
    }

    // Re-roll per spawn so each phase breathes between min/max cadence bounds.
    this.spawnCooldown = Phaser.Math.FloatBetween(phase.minDelay, phase.maxDelay);
  }

  getProgressRatio(): number {
    const durationSeconds = this.level.durationSeconds ?? 1;
    return Phaser.Math.Clamp(this.elapsedSeconds / durationSeconds, 0, 1);
  }

  isLevelComplete(): boolean {
    return this.levelComplete;
  }

  getEnemiesSpawned(): number {
    return this.enemiesSpawned;
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

  private getActivePhase(elapsedSeconds: number): LevelPhase | null {
    return (
      (this.level.phases ?? []).find(
        (phase) => elapsedSeconds >= phase.startAt && elapsedSeconds < phase.endAt
      ) ?? null
    );
  }

  // Weighted random pick so higher-weight enemies appear more often without hard ordering.
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
