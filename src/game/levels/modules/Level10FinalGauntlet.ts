import { LevelDefinition } from '../LevelDefinition';

export const levelModule: LevelDefinition = {
  id: 'level-10',
  name: 'FINAL GAUNTLET',
  bossId: 'boss-alpha-core',
  waveMode: {
    spawnRatePerSecond: 3.6,
    interWaveDelaySeconds: 3
  },
  waves: [
    {
      id: 'w1',
      enemies: [
        { enemyId: 'raider', count: 18 },
        { enemyId: 'wave-eel', count: 21 },
        { enemyId: 'hunter', count: 24 },
        { enemyId: 'lane-jammer', count: 26 },
        { enemyId: 'gravity-well', count: 24 }
      ],
      loot: [
        { powerupId: 'signal-scrap', count: 2 },
        { powerupId: 'flux-battery', count: 2 },
        { powerupId: 'switch-bulwark', count: 1 }
      ]
    },
    {
      id: 'w2',
      enemies: [
        { enemyId: 'splitter', count: 20 },
        { enemyId: 'pulse-ram', count: 23 },
        { enemyId: 'mine-layer', count: 22 },
        { enemyId: 'feign-retreat', count: 22 },
        { enemyId: 'sniper-lock', count: 19 },
        { enemyId: 'undercut-hunter', count: 18 }
      ],
      loot: [
        { powerupId: 'signal-scrap', count: 1 },
        { powerupId: 'flux-battery', count: 1 },
        { powerupId: 'switch-interceptor', count: 1 }
      ]
    },
    {
      id: 'w3',
      enemies: [
        { enemyId: 'yoyo-striker', count: 22 },
        { enemyId: 'orbit-diver', count: 23 },
        { enemyId: 'shield-front', count: 23 },
        { enemyId: 'lane-jammer', count: 24 },
        { enemyId: 'gravity-well', count: 23 },
        { enemyId: 'escort-core', count: 18 }
      ],
      loot: [
        { powerupId: 'signal-scrap', count: 1 },
        { powerupId: 'flux-battery', count: 1 },
        { powerupId: 'switch-lancer', count: 1 }
      ]
    },
    {
      id: 'w4',
      enemies: [
        { enemyId: 'berserk-reaver', count: 24 },
        { enemyId: 'pulse-ram', count: 23 },
        { enemyId: 'feign-retreat', count: 23 },
        { enemyId: 'undercut-hunter', count: 27 },
        { enemyId: 'escort-core', count: 25 },
        { enemyId: 'sniper-lock', count: 22 }
      ],
      loot: [
        { powerupId: 'signal-scrap', count: 1 },
        { powerupId: 'flux-battery', count: 1 },
        { powerupId: 'switch-solar-spiral', count: 1 }
      ]
    },
    {
      id: 'w5',
      enemies: [
        { enemyId: 'lane-jammer', count: 25 },
        { enemyId: 'gravity-well', count: 25 },
        { enemyId: 'escort-core', count: 28 },
        { enemyId: 'undercut-hunter', count: 28 },
        { enemyId: 'pulse-ram', count: 22 },
        { enemyId: 'feign-retreat', count: 22 }
      ],
      loot: [
        { powerupId: 'signal-scrap', count: 1 },
        { powerupId: 'flux-battery', count: 1 },
        { powerupId: 'switch-flamethrower', count: 1 }
      ]
    }
  ]
};
