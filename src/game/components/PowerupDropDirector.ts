import Phaser from 'phaser';
import { LevelDefinition, LevelPowerupDropEntry } from '../levels/LevelDefinition';
import { getPowerupById } from '../powerups/PowerupRegistry';
import { PowerupSpawner } from './PowerupSpawner';

export class PowerupDropDirector {
  private readonly remainingById = new Map<string, number>();
  private destroyedEnemies = 0;

  constructor(
    private readonly level: LevelDefinition,
    private readonly powerupSpawner: PowerupSpawner
  ) {
    // Normalize and validate all configured quotas up-front.
    (this.level.powerups ?? []).forEach((entry) => {
      getPowerupById(entry.powerupId);
      this.remainingById.set(entry.powerupId, Math.max(0, Math.floor(entry.count)));
    });
  }

  onEnemyDestroyed(dropX: number, dropY: number) {
    this.destroyedEnemies += 1;

    const remainingDrops = this.getRemainingDrops();
    if (remainingDrops <= 0) {
      return;
    }

    const estimatedRemainingKills = Math.max(1, this.estimateRemainingEnemyKills());

    // Adaptive probability: starts low and ramps up to meet configured quotas.
    const shouldForceDrop = remainingDrops >= estimatedRemainingKills;
    const dropChance = Phaser.Math.Clamp(remainingDrops / estimatedRemainingKills, 0.08, 1);
    if (!shouldForceDrop && Math.random() > dropChance) {
      return;
    }

    const selected = this.rollDropType();
    if (!selected) {
      return;
    }

    const definition = getPowerupById(selected.powerupId);
    this.remainingById.set(selected.powerupId, selected.count - 1);
    this.powerupSpawner.spawnPowerup(definition, dropX, dropY);
  }

  private estimateRemainingEnemyKills(): number {
    const expectedTotalSpawns = this.estimateTotalEnemySpawns();
    return Math.max(1, expectedTotalSpawns - this.destroyedEnemies);
  }

  // Approximates spawns using phase duration divided by phase average cadence.
  private estimateTotalEnemySpawns(): number {
    return Math.max(
      1,
      Math.round(
        (this.level.phases ?? []).reduce((sum, phase) => {
          const phaseDuration = Math.max(0, phase.endAt - phase.startAt);
          const averageDelay = Math.max(0.05, (phase.minDelay + phase.maxDelay) * 0.5);
          return sum + phaseDuration / averageDelay;
        }, 0)
      )
    );
  }

  private rollDropType(): LevelPowerupDropEntry | null {
    const entries = (this.level.powerups ?? [])
      .map((entry) => ({ powerupId: entry.powerupId, count: this.remainingById.get(entry.powerupId) ?? 0 }))
      .filter((entry) => entry.count > 0);

    if (entries.length === 0) {
      return null;
    }

    const totalRemaining = entries.reduce((sum, entry) => sum + entry.count, 0);
    let roll = Math.random() * totalRemaining;

    for (const entry of entries) {
      roll -= entry.count;
      if (roll <= 0) {
        return entry;
      }
    }

    return entries[entries.length - 1];
  }

  private getRemainingDrops(): number {
    return [...this.remainingById.values()].reduce((sum, value) => sum + value, 0);
  }
}
