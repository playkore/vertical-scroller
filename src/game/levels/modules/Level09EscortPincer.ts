import { LevelDefinition } from '../LevelDefinition';

export const levelModule: LevelDefinition = {
  id: 'level-09',
  name: 'ESCORT PINCER',
  durationSeconds: 165,
  bossId: 'boss-alpha-core',
  phases: [
    {
      startAt: 0,
      endAt: 33,
      minDelay: 0.26,
      maxDelay: 0.38,
      enemies: [
        { enemyId: 'gravity-well', weight: 0.75 },
        { enemyId: 'lane-jammer', weight: 0.75 },
        { enemyId: 'feign-retreat', weight: 0.65 }
      ]
    },
    {
      startAt: 33,
      endAt: 66,
      minDelay: 0.24,
      maxDelay: 0.34,
      enemies: [
        { enemyId: 'gravity-well', weight: 0.7 },
        { enemyId: 'lane-jammer', weight: 0.7 },
        { enemyId: 'escort-core', weight: 0.45 },
        { enemyId: 'pulse-ram', weight: 0.65 }
      ]
    },
    {
      startAt: 66,
      endAt: 99,
      minDelay: 0.22,
      maxDelay: 0.32,
      enemies: [
        { enemyId: 'escort-core', weight: 0.62 },
        { enemyId: 'undercut-hunter', weight: 0.5 },
        { enemyId: 'gravity-well', weight: 0.62 },
        { enemyId: 'lane-jammer', weight: 0.62 },
        { enemyId: 'sniper-lock', weight: 0.55 }
      ]
    },
    {
      startAt: 99,
      endAt: 132,
      minDelay: 0.2,
      maxDelay: 0.3,
      enemies: [
        { enemyId: 'escort-core', weight: 0.75 },
        { enemyId: 'undercut-hunter', weight: 0.72 },
        { enemyId: 'gravity-well', weight: 0.65 },
        { enemyId: 'mine-layer', weight: 0.6 }
      ]
    },
    {
      startAt: 132,
      endAt: 165,
      minDelay: 0.18,
      maxDelay: 0.28,
      enemies: [
        { enemyId: 'escort-core', weight: 0.95 },
        { enemyId: 'undercut-hunter', weight: 0.9 },
        { enemyId: 'lane-jammer', weight: 0.7 }
      ]
    }
  ]
};
