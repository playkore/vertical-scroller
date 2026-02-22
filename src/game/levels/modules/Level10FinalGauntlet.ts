import { LevelDefinition } from '../LevelDefinition';

export const levelModule: LevelDefinition = {
  id: 'level-10',
  name: 'FINAL GAUNTLET',
  durationSeconds: 180,
  bossId: 'boss-alpha-core',
  phases: [
    {
      startAt: 0,
      endAt: 36,
      minDelay: 0.26,
      maxDelay: 0.38,
      enemies: [
        { enemyId: 'raider', weight: 0.45 },
        { enemyId: 'wave-eel', weight: 0.5 },
        { enemyId: 'hunter', weight: 0.6 },
        { enemyId: 'lane-jammer', weight: 0.65 },
        { enemyId: 'gravity-well', weight: 0.6 }
      ]
    },
    {
      startAt: 36,
      endAt: 72,
      minDelay: 0.23,
      maxDelay: 0.35,
      enemies: [
        { enemyId: 'splitter', weight: 0.58 },
        { enemyId: 'pulse-ram', weight: 0.65 },
        { enemyId: 'mine-layer', weight: 0.62 },
        { enemyId: 'feign-retreat', weight: 0.62 },
        { enemyId: 'sniper-lock', weight: 0.55 },
        { enemyId: 'undercut-hunter', weight: 0.52 }
      ]
    },
    {
      startAt: 72,
      endAt: 108,
      minDelay: 0.21,
      maxDelay: 0.33,
      enemies: [
        { enemyId: 'yoyo-striker', weight: 0.6 },
        { enemyId: 'orbit-diver', weight: 0.62 },
        { enemyId: 'shield-front', weight: 0.62 },
        { enemyId: 'lane-jammer', weight: 0.65 },
        { enemyId: 'gravity-well', weight: 0.62 },
        { enemyId: 'escort-core', weight: 0.5 }
      ]
    },
    {
      startAt: 108,
      endAt: 144,
      minDelay: 0.19,
      maxDelay: 0.31,
      enemies: [
        { enemyId: 'berserk-reaver', weight: 0.62 },
        { enemyId: 'pulse-ram', weight: 0.62 },
        { enemyId: 'feign-retreat', weight: 0.62 },
        { enemyId: 'undercut-hunter', weight: 0.7 },
        { enemyId: 'escort-core', weight: 0.65 },
        { enemyId: 'sniper-lock', weight: 0.58 }
      ]
    },
    {
      startAt: 144,
      endAt: 180,
      minDelay: 0.18,
      maxDelay: 0.3,
      enemies: [
        { enemyId: 'lane-jammer', weight: 0.72 },
        { enemyId: 'gravity-well', weight: 0.72 },
        { enemyId: 'escort-core', weight: 0.8 },
        { enemyId: 'undercut-hunter', weight: 0.8 },
        { enemyId: 'pulse-ram', weight: 0.65 },
        { enemyId: 'feign-retreat', weight: 0.65 }
      ]
    }
  ]
};
