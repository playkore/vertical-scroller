import { LevelDefinition } from '../LevelDefinition';

export const levelModule: LevelDefinition = {
  id: 'level-03',
  name: 'OSCILLATION RUN',
  durationSeconds: 120,
  bossId: 'boss-alpha-core',
  phases: [
    {
      startAt: 0,
      endAt: 24,
      minDelay: 1.9,
      maxDelay: 2.7,
      enemies: [
        { enemyId: 'raider', weight: 0.8 },
        { enemyId: 'wave-eel', weight: 0.8 },
        { enemyId: 'hunter', weight: 0.7 }
      ]
    },
    {
      startAt: 24,
      endAt: 48,
      minDelay: 1.8,
      maxDelay: 2.5,
      enemies: [
        { enemyId: 'wave-eel', weight: 0.8 },
        { enemyId: 'saw-drift', weight: 0.65 },
        { enemyId: 'hunter', weight: 0.75 },
        { enemyId: 'yoyo-striker', weight: 0.4 }
      ]
    },
    {
      startAt: 48,
      endAt: 72,
      minDelay: 1.7,
      maxDelay: 2.3,
      enemies: [
        { enemyId: 'wave-eel', weight: 0.75 },
        { enemyId: 'saw-drift', weight: 0.7 },
        { enemyId: 'hunter', weight: 0.7 },
        { enemyId: 'yoyo-striker', weight: 0.55 },
        { enemyId: 'sniper-lock', weight: 0.35 }
      ]
    },
    {
      startAt: 72,
      endAt: 96,
      minDelay: 1.5,
      maxDelay: 2.1,
      enemies: [
        { enemyId: 'hunter', weight: 0.7 },
        { enemyId: 'berserk-reaver', weight: 0.55 },
        { enemyId: 'yoyo-striker', weight: 0.8 },
        { enemyId: 'sniper-lock', weight: 0.6 }
      ]
    },
    {
      startAt: 96,
      endAt: 120,
      minDelay: 1.4,
      maxDelay: 2,
      enemies: [
        { enemyId: 'yoyo-striker', weight: 0.95 },
        { enemyId: 'sniper-lock', weight: 0.8 },
        { enemyId: 'saw-drift', weight: 0.65 }
      ]
    }
  ]
};
