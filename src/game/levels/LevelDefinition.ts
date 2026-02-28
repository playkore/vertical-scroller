import Phaser from 'phaser';
import type { ScoreConfig } from '../stats/ScoreConfig';

// Fixed-rate spawn pacing shared by all waves in a level.
export type LevelWaveMode = {
  // Enemies spawned per second while the current wave is still dequeuing.
  spawnRatePerSecond: number;
  // Pause between clearing a wave and starting the next one (or boss).
  interWaveDelaySeconds: number;
};

// Enemy quota entry for a discrete wave.
export type LevelWaveEnemyEntry = {
  // Registry id of the enemy module to spawn.
  enemyId: string;
  // Total copies to spawn during the wave.
  count: number;
};

// Guaranteed loot awarded after the last enemy of a wave is defeated.
export type LevelWaveLootEntry = {
  // Registry id of the powerup module to spawn.
  powerupId: string;
  // Number of copies to spawn at wave completion.
  count: number;
};

// Single wave payload used by the wave director.
export type LevelWaveDefinition = {
  // Stable wave id within the level.
  id: string;
  // Enemy composition for the wave.
  enemies: LevelWaveEnemyEntry[];
  // Guaranteed reward drops spawned after clearing the wave.
  loot?: LevelWaveLootEntry[];
};

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
  // Optional boss id spawned when timeline reaches duration.
  bossId: string | null;
  // Minimum share of spawned wave enemies that must be destroyed for a perfect clear.
  // Use null to ignore kill coverage and require only no-hit + boss clear.
  perfectKillThreshold?: number | null;
  // Optional score-chain tuning override applied on top of the global defaults.
  scoreConfig?: Partial<ScoreConfig>;
  // Wave-mode pacing config; when omitted, legacy phase data is converted at runtime.
  waveMode?: LevelWaveMode;
  // Explicit wave list; when omitted, legacy phase data is converted at runtime.
  waves?: LevelWaveDefinition[];
  // Legacy timeline duration kept only for backwards-compatible conversion.
  durationSeconds?: number;
  // Legacy drop quotas kept only for backwards-compatible conversion.
  powerups?: LevelPowerupDropEntry[];
  // Legacy phase list kept only for backwards-compatible conversion.
  phases?: LevelPhase[];
}

export type ResolvedWaveLevelConfig = {
  waveMode: LevelWaveMode;
  waves: LevelWaveDefinition[];
  totalEnemies: number;
};

export function resolveWaveLevelConfig(level: LevelDefinition): ResolvedWaveLevelConfig {
  if (level.waveMode && level.waves?.length) {
    const waves = level.waves.map((wave) => ({
      id: wave.id,
      enemies: wave.enemies
        .map((entry) => ({
          enemyId: entry.enemyId,
          count: Math.max(0, Math.floor(entry.count))
        }))
        .filter((entry) => entry.count > 0),
      loot: (wave.loot ?? [])
        .map((entry) => ({
          powerupId: entry.powerupId,
          count: Math.max(0, Math.floor(entry.count))
        }))
        .filter((entry) => entry.count > 0)
    }));

    return {
      waveMode: {
        spawnRatePerSecond: Math.max(0.1, level.waveMode.spawnRatePerSecond),
        interWaveDelaySeconds: Math.max(0, level.waveMode.interWaveDelaySeconds)
      },
      totalEnemies: countWaveEnemies(waves),
      waves
    };
  }

  return convertLegacyLevelToWaveConfig(level);
}

function convertLegacyLevelToWaveConfig(level: LevelDefinition): ResolvedWaveLevelConfig {
  const phases = level.phases ?? [];
  const waves = phases.map((phase, index) => ({
    id: `legacy-w${index + 1}`,
    enemies: buildWaveEnemiesFromPhase(phase),
    loot: [] as LevelWaveLootEntry[]
  }));

  distributeLegacyLoot(level.powerups ?? [], waves);

  const totalEnemies = countWaveEnemies(waves);
  const totalDuration = Math.max(
    1,
    phases.length > 0 ? phases[phases.length - 1].endAt - phases[0].startAt : level.durationSeconds ?? 1
  );
  const estimatedSpawnRate = totalEnemies > 0 ? totalEnemies / totalDuration : 1;

  return {
    waveMode: {
      spawnRatePerSecond: Phaser.Math.Clamp(estimatedSpawnRate, 0.5, 4),
      interWaveDelaySeconds: 3
    },
    waves: waves
      .map((wave) => ({
        ...wave,
        enemies: wave.enemies.filter((entry) => entry.count > 0),
        loot: wave.loot.filter((entry) => entry.count > 0)
      }))
      .filter((wave) => wave.enemies.length > 0),
    totalEnemies
  };
}

function buildWaveEnemiesFromPhase(phase: LevelPhase): LevelWaveEnemyEntry[] {
  const phaseDuration = Math.max(0, phase.endAt - phase.startAt);
  const averageDelay = Math.max(0.05, (phase.minDelay + phase.maxDelay) * 0.5);
  const totalSpawns = Math.max(1, Math.round(phaseDuration / averageDelay));
  const totalWeight = phase.enemies.reduce((sum, entry) => sum + Math.max(0, entry.weight), 0);

  if (totalWeight <= 0) {
    return [];
  }

  const provisional = phase.enemies.map((entry) => {
    const rawCount = (Math.max(0, entry.weight) / totalWeight) * totalSpawns;
    const count = Math.floor(rawCount);
    return {
      enemyId: entry.enemyId,
      count,
      remainder: rawCount - count
    };
  });

  let allocated = provisional.reduce((sum, entry) => sum + entry.count, 0);
  const byRemainder = [...provisional].sort((left, right) => right.remainder - left.remainder);
  let index = 0;

  while (allocated < totalSpawns && byRemainder.length > 0) {
    byRemainder[index % byRemainder.length].count += 1;
    allocated += 1;
    index += 1;
  }

  return provisional
    .filter((entry) => entry.count > 0)
    .map((entry) => ({
      enemyId: entry.enemyId,
      count: entry.count
    }));
}

function distributeLegacyLoot(powerups: LevelPowerupDropEntry[], waves: Array<LevelWaveDefinition & { loot: LevelWaveLootEntry[] }>) {
  if (waves.length === 0) {
    return;
  }

  for (const entry of powerups) {
    const copies = Math.max(0, Math.floor(entry.count));
    for (let i = 0; i < copies; i += 1) {
      const targetWave = waves[i % waves.length];
      const existing = targetWave.loot.find((loot) => loot.powerupId === entry.powerupId);
      if (existing) {
        existing.count += 1;
      } else {
        targetWave.loot.push({
          powerupId: entry.powerupId,
          count: 1
        });
      }
    }
  }
}

function countWaveEnemies(waves: LevelWaveDefinition[]): number {
  return waves.reduce(
    (sum, wave) => sum + wave.enemies.reduce((waveSum, entry) => waveSum + Math.max(0, entry.count), 0),
    0
  );
}
