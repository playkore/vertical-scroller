import { LevelDefinition } from '../LevelDefinition';

export const levelModule: LevelDefinition = {
  id: 'level-08',
  name: 'GRAVITY ARC',
  waveMode: {
    spawnRatePerSecond: 3.3,
    interWaveDelaySeconds: 3
  },
  waves: [
    {
      id: 'w1',
      enemies: [
        { enemyId: 'lane-jammer', count: 34 },
        { enemyId: 'feign-retreat', count: 34 },
        { enemyId: 'mine-layer', count: 29 }
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
        { enemyId: 'lane-jammer', count: 30 },
        { enemyId: 'mine-layer', count: 30 },
        { enemyId: 'gravity-well', count: 19 },
        { enemyId: 'sniper-lock', count: 24 }
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
        { enemyId: 'gravity-well', count: 22 },
        { enemyId: 'lane-jammer', count: 24 },
        { enemyId: 'feign-retreat', count: 24 },
        { enemyId: 'shield-front', count: 21 },
        { enemyId: 'pulse-ram', count: 19 }
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
        { enemyId: 'gravity-well', count: 35 },
        { enemyId: 'lane-jammer', count: 34 },
        { enemyId: 'orbit-diver', count: 28 },
        { enemyId: 'feign-retreat', count: 25 }
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
        { enemyId: 'gravity-well', count: 51 },
        { enemyId: 'lane-jammer', count: 43 },
        { enemyId: 'mine-layer', count: 38 }
      ],
      loot: [
        { powerupId: 'signal-scrap', count: 1 },
        { powerupId: 'flux-battery', count: 1 },
        { powerupId: 'switch-flamethrower', count: 1 }
      ]
    }
  ]
};
