import { LevelDefinition } from '../LevelDefinition';

export const levelModule: LevelDefinition = {
  id: 'level-07',
  name: 'JAMMER CORRIDOR',
  durationSeconds: 150,
  bossId: 'boss-alpha-core',
  powerups: [
      { powerupId: 'signal-scrap', count: 5 },
      { powerupId: 'flux-battery', count: 4 },
      { powerupId: 'switch-bulwark', count: 1 },
      { powerupId: 'switch-interceptor', count: 1 },
      { powerupId: 'switch-lancer', count: 1 },
      { powerupId: 'switch-solar-spiral', count: 1 },
      { powerupId: 'switch-flamethrower', count: 1 }
    ],
  phases: [
    {
      startAt: 0,
      endAt: 30,
      minDelay: 0.28,
      maxDelay: 0.4,
      enemies: [
        { enemyId: 'mine-layer', weight: 0.75 },
        { enemyId: 'feign-retreat', weight: 0.7 },
        { enemyId: 'pulse-ram', weight: 0.65 }
      ]
    },
    {
      startAt: 30,
      endAt: 60,
      minDelay: 0.26,
      maxDelay: 0.38,
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
      minDelay: 0.24,
      maxDelay: 0.36,
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
      minDelay: 0.21,
      maxDelay: 0.33,
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
      minDelay: 0.19,
      maxDelay: 0.31,
      enemies: [
        { enemyId: 'lane-jammer', weight: 1 },
        { enemyId: 'mine-layer', weight: 0.75 },
        { enemyId: 'feign-retreat', weight: 0.75 }
      ]
    }
  ]
};
