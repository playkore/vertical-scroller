import { LevelDefinition } from '../LevelDefinition';

export const levelModule: LevelDefinition = {
  id: 'level-01',
  name: 'NEON FRONTIER',
  durationSeconds: 70,
  bossId: 'boss-alpha-core',
  phases: [
    {
      startAt: 0,
      endAt: 18,
      minDelay: 1.1,
      maxDelay: 1.7,
      enemies: [{ enemyId: 'raider', weight: 1 }]
    },
    {
      startAt: 18,
      endAt: 38,
      minDelay: 0.85,
      maxDelay: 1.3,
      enemies: [
        { enemyId: 'raider', weight: 0.8 },
        { enemyId: 'wave-eel', weight: 0.5 }
      ]
    },
    {
      startAt: 38,
      endAt: 58,
      minDelay: 0.62,
      maxDelay: 0.95,
      enemies: [
        { enemyId: 'raider', weight: 0.6 },
        { enemyId: 'wave-eel', weight: 0.7 },
        { enemyId: 'saw-drift', weight: 0.45 }
      ]
    },
    {
      startAt: 58,
      endAt: 70,
      minDelay: 0.5,
      maxDelay: 0.74,
      enemies: [
        { enemyId: 'wave-eel', weight: 0.9 },
        { enemyId: 'saw-drift', weight: 0.9 }
      ]
    }
  ]
};
