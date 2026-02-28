import { LevelDefinition } from '../LevelDefinition';

export const levelModule: LevelDefinition = {
  id: 'level-06',
  name: 'MINES AND FEINTS',
  bossId: 'boss-alpha-core',
  waveMode: {
    spawnRatePerSecond: 3,
    interWaveDelaySeconds: 3
  },
  waves: [
    {
      id: 'w1',
      enemies: [
        { enemyId: 'shield-front', count: 29 },
        { enemyId: 'pulse-ram', count: 26 },
        { enemyId: 'splitter', count: 24 }
      ],
      loot: [
        { powerupId: 'signal-scrap', count: 1 },
        { powerupId: 'flux-battery', count: 1 },
        { powerupId: 'switch-bulwark', count: 1 }
      ]
    },
    {
      id: 'w2',
      enemies: [
        { enemyId: 'shield-front', count: 25 },
        { enemyId: 'pulse-ram', count: 26 },
        { enemyId: 'mine-layer', count: 17 },
        { enemyId: 'orbit-diver', count: 20 }
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
        { enemyId: 'mine-layer', count: 19 },
        { enemyId: 'feign-retreat', count: 15 },
        { enemyId: 'pulse-ram', count: 21 },
        { enemyId: 'sniper-lock', count: 18 },
        { enemyId: 'shield-front', count: 18 }
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
        { enemyId: 'mine-layer', count: 26 },
        { enemyId: 'feign-retreat', count: 26 },
        { enemyId: 'pulse-ram', count: 25 },
        { enemyId: 'hunter', count: 20 }
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
        { enemyId: 'feign-retreat', count: 37 },
        { enemyId: 'mine-layer', count: 36 },
        { enemyId: 'pulse-ram', count: 30 }
      ],
      loot: [{ powerupId: 'switch-flamethrower', count: 1 }]
    }
  ]
};
