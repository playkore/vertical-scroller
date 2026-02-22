export type LevelEnemyPoolEntry = {
  enemyId: string;
  weight: number;
};

export type LevelPhase = {
  startAt: number;
  endAt: number;
  minDelay: number;
  maxDelay: number;
  enemies: LevelEnemyPoolEntry[];
};

export interface LevelDefinition {
  id: string;
  name: string;
  durationSeconds: number;
  bossId: string | null;
  phases: LevelPhase[];
}
