// Live gameplay counters accumulated by the collision system.
export interface LevelStats {
  score: number;
  enemiesDestroyed: number;
  hitsTaken: number;
  maxMultiplier: number;
  maxChainCount: number;
}

// Complete run payload passed from the gameplay scene to the summary scene.
export interface LevelRunSummaryData extends LevelStats {
  levelId: string;
  durationMs: number;
  enemiesSpawned: number;
  perfectKillThreshold: number | null;
}
