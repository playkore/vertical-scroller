import { LevelDefinition } from '../LevelDefinition';

export const levelModule: LevelDefinition = {
  id: 'level-07',
  name: 'JAMMER CORRIDOR',
  waveMode: {
    spawnRatePerSecond: 3.2,
    interWaveDelaySeconds: 3
  },
  waves: [
    {
      id: 'w1',
      enemies: [
        { enemyId: 'mine-layer', count: 32 },
        { enemyId: 'feign-retreat', count: 29 },
        { enemyId: 'pulse-ram', count: 27 }
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
        { enemyId: 'mine-layer', count: 27 },
        { enemyId: 'feign-retreat', count: 27 },
        { enemyId: 'lane-jammer', count: 17 },
        { enemyId: 'hunter', count: 23 }
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
        { enemyId: 'lane-jammer', count: 22 },
        { enemyId: 'mine-layer', count: 21 },
        { enemyId: 'feign-retreat', count: 21 },
        { enemyId: 'shield-front', count: 19 },
        { enemyId: 'sniper-lock', count: 17 }
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
        { enemyId: 'lane-jammer', count: 34 },
        { enemyId: 'feign-retreat', count: 29 },
        { enemyId: 'pulse-ram', count: 27 },
        { enemyId: 'yoyo-striker', count: 21 }
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
        { enemyId: 'lane-jammer', count: 48 },
        { enemyId: 'mine-layer', count: 36 },
        { enemyId: 'feign-retreat', count: 36 }
      ],
      loot: [
        { powerupId: 'signal-scrap', count: 1 },
        { powerupId: 'switch-flamethrower', count: 1 }
      ]
    }
  ]
};
