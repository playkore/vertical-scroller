import { LevelDefinition } from '../LevelDefinition';

export const levelModule: LevelDefinition = {
  id: 'level-05',
  name: 'ARMOR PULSE',
  durationSeconds: 135,
  bossId: 'boss-alpha-core',
  phases: [
    {
      startAt: 0,
      endAt: 27,
      minDelay: 1.7,
      maxDelay: 2.3,
      enemies: [
        { enemyId: 'hunter', weight: 0.75 },
        { enemyId: 'splitter', weight: 0.65 },
        { enemyId: 'orbit-diver', weight: 0.6 }
      ]
    },
    {
      startAt: 27,
      endAt: 54,
      minDelay: 1.6,
      maxDelay: 2.2,
      enemies: [
        { enemyId: 'splitter', weight: 0.75 },
        { enemyId: 'sniper-lock', weight: 0.6 },
        { enemyId: 'orbit-diver', weight: 0.65 },
        { enemyId: 'shield-front', weight: 0.42 }
      ]
    },
    {
      startAt: 54,
      endAt: 81,
      minDelay: 1.5,
      maxDelay: 2.1,
      enemies: [
        { enemyId: 'orbit-diver', weight: 0.65 },
        { enemyId: 'splitter', weight: 0.7 },
        { enemyId: 'shield-front', weight: 0.6 },
        { enemyId: 'pulse-ram', weight: 0.45 },
        { enemyId: 'yoyo-striker', weight: 0.5 }
      ]
    },
    {
      startAt: 81,
      endAt: 108,
      minDelay: 1.4,
      maxDelay: 2,
      enemies: [
        { enemyId: 'shield-front', weight: 0.75 },
        { enemyId: 'pulse-ram', weight: 0.7 },
        { enemyId: 'sniper-lock', weight: 0.6 },
        { enemyId: 'hunter', weight: 0.5 }
      ]
    },
    {
      startAt: 108,
      endAt: 135,
      minDelay: 1.2,
      maxDelay: 1.9,
      enemies: [
        { enemyId: 'pulse-ram', weight: 0.9 },
        { enemyId: 'shield-front', weight: 0.8 },
        { enemyId: 'splitter', weight: 0.65 }
      ]
    }
  ]
};
