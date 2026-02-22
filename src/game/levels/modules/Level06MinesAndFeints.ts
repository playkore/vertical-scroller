import { LevelDefinition } from '../LevelDefinition';

export const levelModule: LevelDefinition = {
  id: 'level-06',
  name: 'MINES AND FEINTS',
  durationSeconds: 150,
  bossId: 'boss-alpha-core',
  phases: [
    {
      startAt: 0,
      endAt: 30,
      minDelay: 1.6,
      maxDelay: 2.2,
      enemies: [
        { enemyId: 'shield-front', weight: 0.7 },
        { enemyId: 'pulse-ram', weight: 0.65 },
        { enemyId: 'splitter', weight: 0.6 }
      ]
    },
    {
      startAt: 30,
      endAt: 60,
      minDelay: 1.4,
      maxDelay: 2,
      enemies: [
        { enemyId: 'shield-front', weight: 0.65 },
        { enemyId: 'pulse-ram', weight: 0.7 },
        { enemyId: 'mine-layer', weight: 0.45 },
        { enemyId: 'orbit-diver', weight: 0.55 }
      ]
    },
    {
      startAt: 60,
      endAt: 90,
      minDelay: 1.35,
      maxDelay: 1.95,
      enemies: [
        { enemyId: 'mine-layer', weight: 0.65 },
        { enemyId: 'feign-retreat', weight: 0.5 },
        { enemyId: 'pulse-ram', weight: 0.7 },
        { enemyId: 'sniper-lock', weight: 0.6 },
        { enemyId: 'shield-front', weight: 0.6 }
      ]
    },
    {
      startAt: 90,
      endAt: 120,
      minDelay: 1.25,
      maxDelay: 1.85,
      enemies: [
        { enemyId: 'mine-layer', weight: 0.7 },
        { enemyId: 'feign-retreat', weight: 0.7 },
        { enemyId: 'pulse-ram', weight: 0.7 },
        { enemyId: 'hunter', weight: 0.55 }
      ]
    },
    {
      startAt: 120,
      endAt: 150,
      minDelay: 1.1,
      maxDelay: 1.8,
      enemies: [
        { enemyId: 'feign-retreat', weight: 0.9 },
        { enemyId: 'mine-layer', weight: 0.9 },
        { enemyId: 'pulse-ram', weight: 0.75 }
      ]
    }
  ]
};
