import { LevelDefinition } from '../LevelDefinition';

export const levelModule: LevelDefinition = {
  id: 'level-01',
  name: 'NEON FRONTIER',
  durationSeconds: 105,
  bossId: 'boss-alpha-core',
  phases: [
    {
      startAt: 0,
      endAt: 24,
      minDelay: 3,
      maxDelay: 3.8,
      enemies: [{ enemyId: 'raider', weight: 1 }]
    },
    {
      startAt: 24,
      endAt: 48,
      minDelay: 2.6,
      maxDelay: 3.4,
      enemies: [
        { enemyId: 'raider', weight: 0.9 },
        { enemyId: 'wave-eel', weight: 0.55 }
      ]
    },
    {
      startAt: 48,
      endAt: 72,
      minDelay: 2.4,
      maxDelay: 3.2,
      enemies: [
        { enemyId: 'raider', weight: 0.75 },
        { enemyId: 'wave-eel', weight: 0.7 },
        { enemyId: 'saw-drift', weight: 0.45 }
      ]
    },
    {
      startAt: 72,
      endAt: 93,
      minDelay: 2.2,
      maxDelay: 2.9,
      enemies: [
        { enemyId: 'wave-eel', weight: 0.9 },
        { enemyId: 'saw-drift', weight: 0.85 },
        { enemyId: 'raider', weight: 0.45 }
      ]
    },
    {
      startAt: 93,
      endAt: 105,
      minDelay: 2,
      maxDelay: 2.6,
      enemies: [
        { enemyId: 'wave-eel', weight: 1 },
        { enemyId: 'saw-drift', weight: 1 }
      ]
    }
  ]
};
