import { LevelDefinition } from '../LevelDefinition';

export const levelModule: LevelDefinition = {
  id: 'level-09',
  name: 'ESCORT PINCER',
  bossId: 'boss-alpha-core',
  waveMode: {
    spawnRatePerSecond: 3.4,
    interWaveDelaySeconds: 3
  },
  waves: [
    {
      id: 'w1',
      enemies: [
        { enemyId: 'gravity-well', count: 36 },
        { enemyId: 'lane-jammer', count: 36 },
        { enemyId: 'feign-retreat', count: 31 }
      ],
      loot: [
        { powerupId: 'signal-scrap', count: 2 },
        { powerupId: 'flux-battery', count: 1 },
        { powerupId: 'switch-bulwark', count: 1 }
      ]
    },
    {
      id: 'w2',
      enemies: [
        { enemyId: 'gravity-well', count: 32 },
        { enemyId: 'lane-jammer', count: 31 },
        { enemyId: 'escort-core', count: 21 },
        { enemyId: 'pulse-ram', count: 30 }
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
        { enemyId: 'escort-core', count: 26 },
        { enemyId: 'undercut-hunter', count: 21 },
        { enemyId: 'gravity-well', count: 26 },
        { enemyId: 'lane-jammer', count: 26 },
        { enemyId: 'sniper-lock', count: 23 }
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
        { enemyId: 'escort-core', count: 36 },
        { enemyId: 'undercut-hunter', count: 35 },
        { enemyId: 'gravity-well', count: 32 },
        { enemyId: 'mine-layer', count: 29 }
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
        { enemyId: 'escort-core', count: 53 },
        { enemyId: 'undercut-hunter', count: 51 },
        { enemyId: 'lane-jammer', count: 39 }
      ],
      loot: [
        { powerupId: 'signal-scrap', count: 1 },
        { powerupId: 'flux-battery', count: 1 },
        { powerupId: 'switch-flamethrower', count: 1 }
      ]
    }
  ]
};
