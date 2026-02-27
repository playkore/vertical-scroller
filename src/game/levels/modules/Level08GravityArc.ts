import { LevelDefinition } from '../LevelDefinition';

export const levelModule: LevelDefinition = {
  id: 'level-08',
  name: 'GRAVITY ARC',
  durationSeconds: 165,
  bossId: 'boss-alpha-core',
  powerups: [
      { powerupId: 'signal-scrap', count: 5 },
      { powerupId: 'flux-battery', count: 5 },
      { powerupId: 'switch-bulwark', count: 1 },
      { powerupId: 'switch-interceptor', count: 1 },
      { powerupId: 'switch-lancer', count: 1 },
      { powerupId: 'switch-solar-spiral', count: 1 }
    ],
  phases: [
    {
      startAt: 0,
      endAt: 33,
      minDelay: 0.28,
      maxDelay: 0.4,
      enemies: [
        { enemyId: 'lane-jammer', weight: 0.75 },
        { enemyId: 'feign-retreat', weight: 0.75 },
        { enemyId: 'mine-layer', weight: 0.65 }
      ]
    },
    {
      startAt: 33,
      endAt: 66,
      minDelay: 0.26,
      maxDelay: 0.38,
      enemies: [
        { enemyId: 'lane-jammer', weight: 0.7 },
        { enemyId: 'mine-layer', weight: 0.7 },
        { enemyId: 'gravity-well', weight: 0.45 },
        { enemyId: 'sniper-lock', weight: 0.55 }
      ]
    },
    {
      startAt: 66,
      endAt: 99,
      minDelay: 0.24,
      maxDelay: 0.36,
      enemies: [
        { enemyId: 'gravity-well', weight: 0.6 },
        { enemyId: 'lane-jammer', weight: 0.65 },
        { enemyId: 'feign-retreat', weight: 0.65 },
        { enemyId: 'shield-front', weight: 0.55 },
        { enemyId: 'pulse-ram', weight: 0.5 }
      ]
    },
    {
      startAt: 99,
      endAt: 132,
      minDelay: 0.21,
      maxDelay: 0.33,
      enemies: [
        { enemyId: 'gravity-well', weight: 0.75 },
        { enemyId: 'lane-jammer', weight: 0.75 },
        { enemyId: 'orbit-diver', weight: 0.6 },
        { enemyId: 'feign-retreat', weight: 0.55 }
      ]
    },
    {
      startAt: 132,
      endAt: 165,
      minDelay: 0.19,
      maxDelay: 0.31,
      enemies: [
        { enemyId: 'gravity-well', weight: 0.95 },
        { enemyId: 'lane-jammer', weight: 0.8 },
        { enemyId: 'mine-layer', weight: 0.7 }
      ]
    }
  ]
};
