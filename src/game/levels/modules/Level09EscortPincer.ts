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
      minDelay: 1.3,
      maxDelay: 1.9,
      enemies: [
        { enemyId: 'gravity-well', weight: 0.75 },
        { enemyId: 'lane-jammer', weight: 0.75 },
        { enemyId: 'feign-retreat', weight: 0.65 }
      ]
    },
    {
      startAt: 33,
      endAt: 66,
      minDelay: 1.2,
      maxDelay: 1.7,
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
      minDelay: 1.1,
      maxDelay: 1.6,
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
      minDelay: 1,
      maxDelay: 1.5,
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
      minDelay: 0.9,
      maxDelay: 1.4,
      enemies: [
        { enemyId: 'escort-core', weight: 0.95 },
        { enemyId: 'undercut-hunter', weight: 0.9 },
        { enemyId: 'lane-jammer', weight: 0.7 }
      ]
    }
  ]
};
