import type { ScoreConfig } from '../stats/ScoreConfig';

// Weighted enemy entry used for random picks within a phase.
export type LevelEnemyPoolEntry = {
  // Registry id of the enemy module to spawn.
  enemyId: string;
  // Relative chance of selecting this enemy compared with siblings.
  weight: number;
};

// Time-sliced spawn rule for a section of the level timeline.
export type LevelPhase = {
  // Inclusive timeline start (seconds).
  startAt: number;
  // Exclusive timeline end (seconds).
  endAt: number;
  // Minimum random delay between enemy spawns while this phase is active.
  minDelay: number;
  // Maximum random delay between enemy spawns while this phase is active.
  maxDelay: number;
  // Weighted pool used by the level director to choose the next enemy.
  enemies: LevelEnemyPoolEntry[];
};

// Per-level quota describing how many pickups of a given type should drop.
export type LevelPowerupDropEntry = {
  // Registry id of the powerup module to drop.
  powerupId: string;
  // Target number of drops to attempt across the level.
  count: number;
};

// Complete level contract consumed by the level registry and level director.
export interface LevelDefinition {
  // Stable registry id.
  id: string;
  // Human-readable name shown in HUD/menu UI.
  name: string;
  // Total timeline length before level completion/boss deploy.
  durationSeconds: number;
  // Optional boss id spawned when timeline reaches duration.
  bossId: string | null;
  // Minimum share of spawned wave enemies that must be destroyed for a perfect clear.
  // Use null to ignore kill coverage and require only no-hit + boss clear.
  perfectKillThreshold?: number | null;
  // Optional score-chain tuning override applied on top of the global defaults.
  scoreConfig?: Partial<ScoreConfig>;
  // Drop quotas used by the powerup drop director for this level.
  powerups: LevelPowerupDropEntry[];
  // Ordered phase list defining spawn pacing and composition over time.
  phases: LevelPhase[];
}
