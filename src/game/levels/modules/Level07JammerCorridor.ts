import { LevelDefinition } from '../LevelDefinition';

export const levelModule: LevelDefinition = {
  id: 'level-07',
  name: 'JAMMER CORRIDOR',
  durationSeconds: 150,
  bossId: 'boss-alpha-core',
  phases: [
    {
      startAt: 0,
      endAt: 30,
      minDelay: 1.4,
      maxDelay: 2,
      enemies: [
        { enemyId: 'mine-layer', weight: 0.75 },
        { enemyId: 'feign-retreat', weight: 0.7 },
        { enemyId: 'pulse-ram', weight: 0.65 }
      ]
    },
    {
      startAt: 30,
      endAt: 60,
      minDelay: 1.3,
      maxDelay: 1.9,
      enemies: [
        { enemyId: 'mine-layer', weight: 0.7 },
        { enemyId: 'feign-retreat', weight: 0.7 },
        { enemyId: 'lane-jammer', weight: 0.45 },
        { enemyId: 'hunter', weight: 0.6 }
      ]
    },
    {
      startAt: 60,
      endAt: 90,
      minDelay: 1.2,
      maxDelay: 1.8,
      enemies: [
        { enemyId: 'lane-jammer', weight: 0.65 },
        { enemyId: 'mine-layer', weight: 0.65 },
        { enemyId: 'feign-retreat', weight: 0.65 },
        { enemyId: 'shield-front', weight: 0.55 },
        { enemyId: 'sniper-lock', weight: 0.5 }
      ]
    },
    {
      startAt: 90,
      endAt: 120,
      minDelay: 1.05,
      maxDelay: 1.65,
      enemies: [
        { enemyId: 'lane-jammer', weight: 0.8 },
        { enemyId: 'feign-retreat', weight: 0.7 },
        { enemyId: 'pulse-ram', weight: 0.65 },
        { enemyId: 'yoyo-striker', weight: 0.5 }
      ]
    },
    {
      startAt: 120,
      endAt: 150,
      minDelay: 0.95,
      maxDelay: 1.55,
      enemies: [
        { enemyId: 'lane-jammer', weight: 1 },
        { enemyId: 'mine-layer', weight: 0.75 },
        { enemyId: 'feign-retreat', weight: 0.75 }
      ]
    }
  ]
};
