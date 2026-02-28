import { getLevelById } from '../levels/LevelRegistry';

export const PROGRESSION_STORAGE_KEY = 'vscroll_cga_progress_v1';
export const PROGRESSION_SCHEMA_VERSION = 1;

// Fixed behavior switch for the StartScene continue button flow.
export const CONTINUE_BEHAVIOR = 'open-level-select' as const;

type ContinueBehavior = typeof CONTINUE_BEHAVIOR;

export const RANK_ORDER = ['S', 'A', 'B', 'C', 'D'] as const;
export type Rank = (typeof RANK_ORDER)[number];
export const ACHIEVEMENT_CODES = ['noHit', 'perfect'] as const;
export type AchievementCode = (typeof ACHIEVEMENT_CODES)[number];

// Full metric payload describing a single level run attempt.
export interface LevelResult {
  levelId: string;
  score: number;
  hitsTaken: number;
  enemiesDestroyed: number;
  bossesDefeated: number;
  durationMs: number;
  bossConfigured: boolean;
  enemiesSpawned: number;
  perfectKillThreshold: number | null;
}

// Persisted run snapshot stored when a new personal best is achieved.
export interface StoredBestRun {
  score: number;
  rank: Rank;
  hitsTaken: number;
  enemiesDestroyed: number;
  bossesDefeated: number;
  durationMs: number;
  endedAtIso: string;
}

// Per-level achievement flags and first unlock timestamps.
export interface LevelAchievementsRecord {
  noHit: boolean;
  perfect: boolean;
  noHitFirstAtIso: string | null;
  perfectFirstAtIso: string | null;
}

// Per-level progress/personal-best state.
export interface LevelProgressRecord {
  completed: boolean;
  bestScore: number;
  bestRank: Rank;
  bestRun: StoredBestRun;
  achievements: LevelAchievementsRecord;
}

// Top-level progression payload persisted in localStorage.
export interface PlayerProgress {
  schemaVersion: number;
  lastPlayedLevelId: string | null;
  levels: Record<string, LevelProgressRecord>;
}

export type PersistedRunResult = {
  rank: Rank;
  isNewRecord: boolean;
  previousBest: LevelProgressRecord | null;
  updatedBest: LevelProgressRecord;
  unlockedAchievements: AchievementCode[];
  updatedAchievements: LevelAchievementsRecord;
};

const DEFAULT_PROGRESS: PlayerProgress = {
  schemaVersion: PROGRESSION_SCHEMA_VERSION,
  lastPlayedLevelId: null,
  levels: {}
};

export function calculateRank(result: Pick<LevelResult, 'hitsTaken' | 'bossConfigured' | 'bossesDefeated'>): Rank {
  let rank: Rank;

  if (result.hitsTaken === 0) {
    rank = 'S';
  } else if (result.hitsTaken <= 2) {
    rank = 'A';
  } else if (result.hitsTaken <= 5) {
    rank = 'B';
  } else if (result.hitsTaken <= 9) {
    rank = 'C';
  } else {
    rank = 'D';
  }

  if (result.bossConfigured && result.bossesDefeated === 0 && compareRanks(rank, 'C') < 0) {
    return 'C';
  }

  return rank;
}

export function compareRanks(left: Rank, right: Rank): number {
  return rankToScore(left) - rankToScore(right);
}

export function getProgress(): PlayerProgress {
  if (typeof window === 'undefined') {
    return structuredClone(DEFAULT_PROGRESS);
  }

  const raw = window.localStorage.getItem(PROGRESSION_STORAGE_KEY);
  if (!raw) {
    return structuredClone(DEFAULT_PROGRESS);
  }

  try {
    const parsed = JSON.parse(raw) as PlayerProgress;
    return sanitizeProgress(parsed);
  } catch {
    return structuredClone(DEFAULT_PROGRESS);
  }
}

export function setLastPlayedLevel(levelId: string): PlayerProgress {
  const nextProgress = {
    ...getProgress(),
    lastPlayedLevelId: levelId
  };
  persistProgress(nextProgress);
  return nextProgress;
}

export function saveLevelResult(result: LevelResult): PersistedRunResult {
  const progress = getProgress();
  const previousBest = progress.levels[result.levelId] ?? null;
  const previousAchievements = previousBest?.achievements ?? createEmptyAchievementsRecord();

  const rank = calculateRank(result);
  const endedAtIso = new Date().toISOString();
  const currentRun: StoredBestRun = {
    score: result.score,
    rank,
    hitsTaken: result.hitsTaken,
    enemiesDestroyed: result.enemiesDestroyed,
    bossesDefeated: result.bossesDefeated,
    durationMs: result.durationMs,
    endedAtIso
  };
  const achievedThisRun = calculateAchievements(result);
  const unlockedAchievements = ACHIEVEMENT_CODES.filter(
    (code) => achievedThisRun[code] && !previousAchievements[code]
  );
  const updatedAchievements: LevelAchievementsRecord = {
    noHit: previousAchievements.noHit || achievedThisRun.noHit,
    perfect: previousAchievements.perfect || achievedThisRun.perfect,
    noHitFirstAtIso:
      previousAchievements.noHitFirstAtIso ?? (achievedThisRun.noHit ? endedAtIso : null),
    perfectFirstAtIso:
      previousAchievements.perfectFirstAtIso ?? (achievedThisRun.perfect ? endedAtIso : null)
  };

  const didImproveScore = !previousBest || result.score > previousBest.bestScore;
  const didImproveRank = !previousBest || compareRanks(rank, previousBest.bestRank) > 0;

  const updatedBest: LevelProgressRecord = previousBest
    ? {
        completed: true,
        bestScore: didImproveScore ? result.score : previousBest.bestScore,
        bestRank: didImproveRank ? rank : previousBest.bestRank,
        bestRun: didImproveScore || didImproveRank ? currentRun : previousBest.bestRun,
        achievements: updatedAchievements
      }
    : {
        completed: true,
        bestScore: result.score,
        bestRank: rank,
        bestRun: currentRun,
        achievements: updatedAchievements
      };

  const isNewRecord = didImproveScore || didImproveRank;

  const nextProgress: PlayerProgress = {
    ...progress,
    levels: {
      ...progress.levels,
      [result.levelId]: updatedBest
    }
  };
  persistProgress(nextProgress);

  for (const code of unlockedAchievements) {
    onAchievementUnlocked(result.levelId, code);
  }

  return {
    rank,
    isNewRecord,
    previousBest,
    updatedBest,
    unlockedAchievements,
    updatedAchievements
  };
}

export function getContinueTargetLevelId(): string | null {
  const { lastPlayedLevelId } = getProgress();
  if (!lastPlayedLevelId) {
    return null;
  }

  try {
    getLevelById(lastPlayedLevelId);
    return lastPlayedLevelId;
  } catch {
    return null;
  }
}

export function getContinueBehavior(): ContinueBehavior {
  return CONTINUE_BEHAVIOR;
}

function rankToScore(rank: Rank): number {
  return RANK_ORDER.length - RANK_ORDER.indexOf(rank);
}

function calculateAchievements(result: LevelResult): Record<AchievementCode, boolean> {
  const noHit = result.hitsTaken === 0;
  const bossClearSatisfied = !result.bossConfigured || result.bossesDefeated > 0;
  const killThresholdSatisfied = isPerfectKillThresholdSatisfied(result);

  return {
    noHit,
    perfect: noHit && bossClearSatisfied && killThresholdSatisfied
  };
}

function isPerfectKillThresholdSatisfied(result: Pick<LevelResult, 'enemiesDestroyed' | 'enemiesSpawned' | 'perfectKillThreshold'>): boolean {
  if (result.perfectKillThreshold === null) {
    return true;
  }

  if (result.enemiesSpawned <= 0) {
    return true;
  }

  const killRatio = result.enemiesDestroyed / result.enemiesSpawned;
  return killRatio >= result.perfectKillThreshold;
}

function persistProgress(progress: PlayerProgress) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(PROGRESSION_STORAGE_KEY, JSON.stringify(progress));
}

function sanitizeProgress(progress: PlayerProgress): PlayerProgress {
  if (progress.schemaVersion !== PROGRESSION_SCHEMA_VERSION) {
    return structuredClone(DEFAULT_PROGRESS);
  }

  const levels: Record<string, LevelProgressRecord> = {};

  for (const [levelId, levelRecord] of Object.entries(progress.levels ?? {})) {
    if (!levelRecord?.bestRun || !isRank(levelRecord.bestRank) || !isRank(levelRecord.bestRun.rank)) {
      continue;
    }

    levels[levelId] = {
      completed: Boolean(levelRecord.completed),
      bestScore: Number(levelRecord.bestScore) || 0,
      bestRank: levelRecord.bestRank,
      bestRun: {
        score: Number(levelRecord.bestRun.score) || 0,
        rank: levelRecord.bestRun.rank,
        hitsTaken: Number(levelRecord.bestRun.hitsTaken) || 0,
        enemiesDestroyed: Number(levelRecord.bestRun.enemiesDestroyed) || 0,
        bossesDefeated: Number(levelRecord.bestRun.bossesDefeated) || 0,
        durationMs: Number(levelRecord.bestRun.durationMs) || 0,
        endedAtIso: String(levelRecord.bestRun.endedAtIso || '')
      },
      achievements: sanitizeAchievements(levelRecord.achievements)
    };
  }

  return {
    schemaVersion: PROGRESSION_SCHEMA_VERSION,
    lastPlayedLevelId: progress.lastPlayedLevelId ?? null,
    levels
  };
}

function isRank(rank: string): rank is Rank {
  return RANK_ORDER.includes(rank as Rank);
}

function createEmptyAchievementsRecord(): LevelAchievementsRecord {
  return {
    noHit: false,
    perfect: false,
    noHitFirstAtIso: null,
    perfectFirstAtIso: null
  };
}

function sanitizeAchievements(raw: unknown): LevelAchievementsRecord {
  if (!raw || typeof raw !== 'object') {
    return createEmptyAchievementsRecord();
  }

  const record = raw as Partial<LevelAchievementsRecord>;
  return {
    noHit: Boolean(record.noHit),
    perfect: Boolean(record.perfect),
    noHitFirstAtIso: typeof record.noHitFirstAtIso === 'string' ? record.noHitFirstAtIso : null,
    perfectFirstAtIso:
      typeof record.perfectFirstAtIso === 'string' ? record.perfectFirstAtIso : null
  };
}

export function onAchievementUnlocked(levelId: string, achievementCode: AchievementCode) {
  if (typeof console !== 'undefined') {
    console.info(`[progression] unlocked ${achievementCode} for ${levelId}`);
  }
}
