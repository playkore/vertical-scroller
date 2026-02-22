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
  // Ordered phase list defining spawn pacing and composition over time.
  phases: LevelPhase[];
}
