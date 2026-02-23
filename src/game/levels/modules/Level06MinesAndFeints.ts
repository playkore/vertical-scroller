import { LevelDefinition } from '../LevelDefinition';

export const levelModule: LevelDefinition = {
  id: 'level-06',
  name: 'MINES AND FEINTS',
  durationSeconds: 150,
  bossId: 'boss-alpha-core',
  powerups: [
      { powerupId: 'signal-scrap', count: 4 },
      { powerupId: 'flux-battery', count: 4 }
    ],
  phases: [
    {
      startAt: 0,
      endAt: 30,
      minDelay: 0.32,
      maxDelay: 0.44,
      enemies: [
        { enemyId: 'shield-front', weight: 0.7 },
        { enemyId: 'pulse-ram', weight: 0.65 },
        { enemyId: 'splitter', weight: 0.6 }
      ]
    },
    {
      startAt: 30,
      endAt: 60,
      minDelay: 0.28,
      maxDelay: 0.4,
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
      minDelay: 0.27,
      maxDelay: 0.39,
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
      minDelay: 0.25,
      maxDelay: 0.37,
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
      minDelay: 0.22,
      maxDelay: 0.36,
      enemies: [
        { enemyId: 'feign-retreat', weight: 0.9 },
        { enemyId: 'mine-layer', weight: 0.9 },
        { enemyId: 'pulse-ram', weight: 0.75 }
      ]
    }
  ]
};
