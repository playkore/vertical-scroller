import { LevelDefinition } from '../LevelDefinition';

export const levelModule: LevelDefinition = {
  id: 'level-05',
  name: 'ARMOR PULSE',
  waveMode: {
    spawnRatePerSecond: 2.8,
    interWaveDelaySeconds: 3
  },
  waves: [
    {
      id: 'w1',
      enemies: [
        { enemyId: 'hunter', count: 26 },
        { enemyId: 'splitter', count: 22 },
        { enemyId: 'orbit-diver', count: 20 }
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
        { enemyId: 'splitter', count: 22 },
        { enemyId: 'sniper-lock', count: 18 },
        { enemyId: 'orbit-diver', count: 19 },
        { enemyId: 'shield-front', count: 12 }
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
        { enemyId: 'orbit-diver', count: 17 },
        { enemyId: 'splitter', count: 18 },
        { enemyId: 'shield-front', count: 15 },
        { enemyId: 'pulse-ram', count: 12 },
        { enemyId: 'yoyo-striker', count: 13 }
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
        { enemyId: 'shield-front', count: 23 },
        { enemyId: 'pulse-ram', count: 22 },
        { enemyId: 'sniper-lock', count: 19 },
        { enemyId: 'hunter', count: 15 }
      ],
      loot: [
        { powerupId: 'signal-scrap', count: 1 },
        { powerupId: 'switch-solar-spiral', count: 1 }
      ]
    },
    {
      id: 'w5',
      enemies: [
        { enemyId: 'pulse-ram', count: 33 },
        { enemyId: 'shield-front', count: 30 },
        { enemyId: 'splitter', count: 24 }
      ],
      loot: [{ powerupId: 'switch-flamethrower', count: 1 }]
    }
  ]
};
