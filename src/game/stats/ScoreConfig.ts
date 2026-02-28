// Score-chain tuning shared between runtime systems and level definitions.
export interface ScoreConfig {
  // Time allowed between kills before the active chain expires.
  chainWindowMs: number;
  // Multiplier increase applied per chained kill.
  multiplierStep: number;
  // Hard cap for the active multiplier.
  maxMultiplier: number;
  // Baseline multiplier state used when no chain is active.
  minMultiplier: number;
  // Base score awarded for a regular enemy kill before multiplier.
  baseKillScore: number;
  // Base score awarded for a boss kill before multiplier.
  bossKillScore: number;
}

export const DEFAULT_SCORE_CONFIG: ScoreConfig = {
  chainWindowMs: 2000,
  multiplierStep: 0.1,
  maxMultiplier: 5,
  minMultiplier: 1,
  baseKillScore: 10,
  bossKillScore: 500
};

export function resolveScoreConfig(overrides?: Partial<ScoreConfig>): ScoreConfig {
  const merged = {
    ...DEFAULT_SCORE_CONFIG,
    ...overrides
  };

  return {
    ...merged,
    maxMultiplier: Math.max(merged.minMultiplier, merged.maxMultiplier)
  };
}
