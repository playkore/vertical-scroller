import { getLevelById } from '../levels/LevelRegistry';

export const PROGRESSION_STORAGE_KEY = 'vscroll_cga_progress_v1';
export const PROGRESSION_SCHEMA_VERSION = 1;

// Fixed behavior switch for the StartScene continue button flow.
export const CONTINUE_BEHAVIOR = 'open-level-select' as const;

type ContinueBehavior = typeof CONTINUE_BEHAVIOR;

export const RANK_ORDER = ['S', 'A', 'B', 'C', 'D'] as const;
export type Rank = (typeof RANK_ORDER)[number];

// Full metric payload describing a single level run attempt.
export interface LevelResult {
  levelId: string;
  score: number;
  hitsTaken: number;
  enemiesDestroyed: number;
  bossesDefeated: number;
  durationMs: number;
  bossConfigured: boolean;
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

// Per-level progress/personal-best state.
export interface LevelProgressRecord {
  completed: boolean;
  bestScore: number;
  bestRank: Rank;
  bestRun: StoredBestRun;
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

  const rank = calculateRank(result);
  const candidateBest: LevelProgressRecord = {
    completed: true,
    bestScore: result.score,
    bestRank: rank,
    bestRun: {
      score: result.score,
      rank,
      hitsTaken: result.hitsTaken,
      enemiesDestroyed: result.enemiesDestroyed,
      bossesDefeated: result.bossesDefeated,
      durationMs: result.durationMs,
      endedAtIso: new Date().toISOString()
    }
  };

  const isNewRecord = !previousBest || isCandidateBetter(candidateBest, previousBest);
  const updatedBest = isNewRecord
    ? candidateBest
    : {
        ...previousBest,
        completed: true
      };

  const nextProgress: PlayerProgress = {
    ...progress,
    levels: {
      ...progress.levels,
      [result.levelId]: updatedBest
    }
  };
  persistProgress(nextProgress);

  return {
    rank,
    isNewRecord,
    previousBest,
    updatedBest
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

function isCandidateBetter(candidate: LevelProgressRecord, current: LevelProgressRecord): boolean {
  const rankDelta = compareRanks(candidate.bestRank, current.bestRank);
  if (rankDelta > 0) {
    return true;
  }

  if (rankDelta < 0) {
    return false;
  }

  return candidate.bestScore > current.bestScore;
}

function rankToScore(rank: Rank): number {
  return RANK_ORDER.length - RANK_ORDER.indexOf(rank);
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
      }
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
