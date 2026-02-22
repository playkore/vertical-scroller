import { LevelDefinition } from '../LevelDefinition';

export const levelModule: LevelDefinition = {
  id: 'level-04',
  name: 'DIVER SPLIT',
  durationSeconds: 135,
  bossId: 'boss-alpha-core',
  phases: [
    {
      startAt: 0,
      endAt: 27,
      minDelay: 1.9,
      maxDelay: 2.5,
      enemies: [
        { enemyId: 'wave-eel', weight: 0.8 },
        { enemyId: 'hunter', weight: 0.75 },
        { enemyId: 'yoyo-striker', weight: 0.6 }
      ]
    },
    {
      startAt: 27,
      endAt: 54,
      minDelay: 1.7,
      maxDelay: 2.3,
      enemies: [
        { enemyId: 'saw-drift', weight: 0.75 },
        { enemyId: 'hunter', weight: 0.7 },
        { enemyId: 'yoyo-striker', weight: 0.7 },
        { enemyId: 'orbit-diver', weight: 0.4 }
      ]
    },
    {
      startAt: 54,
      endAt: 81,
      minDelay: 1.6,
      maxDelay: 2.2,
      enemies: [
        { enemyId: 'hunter', weight: 0.65 },
        { enemyId: 'yoyo-striker', weight: 0.75 },
        { enemyId: 'sniper-lock', weight: 0.55 },
        { enemyId: 'orbit-diver', weight: 0.55 },
        { enemyId: 'splitter', weight: 0.4 }
      ]
    },
    {
      startAt: 81,
      endAt: 108,
      minDelay: 1.5,
      maxDelay: 2.1,
      enemies: [
        { enemyId: 'sniper-lock', weight: 0.65 },
        { enemyId: 'orbit-diver', weight: 0.75 },
        { enemyId: 'splitter', weight: 0.65 },
        { enemyId: 'berserk-reaver', weight: 0.45 }
      ]
    },
    {
      startAt: 108,
      endAt: 135,
      minDelay: 1.3,
      maxDelay: 2,
      enemies: [
        { enemyId: 'orbit-diver', weight: 0.9 },
        { enemyId: 'splitter', weight: 0.85 },
        { enemyId: 'sniper-lock', weight: 0.65 }
      ]
    }
  ]
};
