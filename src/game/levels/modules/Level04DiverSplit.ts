import { LevelDefinition } from '../LevelDefinition';

export const levelModule: LevelDefinition = {
  id: 'level-04',
  name: 'DIVER SPLIT',
  bossId: 'boss-alpha-core',
  waveMode: {
    spawnRatePerSecond: 2.6,
    interWaveDelaySeconds: 3
  },
  waves: [
    {
      id: 'w1',
      enemies: [
        { enemyId: 'wave-eel', count: 23 },
        { enemyId: 'hunter', count: 21 },
        { enemyId: 'yoyo-striker', count: 17 }
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
        { enemyId: 'saw-drift', count: 20 },
        { enemyId: 'hunter', count: 19 },
        { enemyId: 'yoyo-striker', count: 18 },
        { enemyId: 'orbit-diver', count: 11 }
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
        { enemyId: 'hunter', count: 16 },
        { enemyId: 'yoyo-striker', count: 18 },
        { enemyId: 'sniper-lock', count: 14 },
        { enemyId: 'orbit-diver', count: 13 },
        { enemyId: 'splitter', count: 10 }
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
        { enemyId: 'sniper-lock', count: 20 },
        { enemyId: 'orbit-diver', count: 22 },
        { enemyId: 'splitter', count: 19 },
        { enemyId: 'berserk-reaver', count: 14 }
      ],
      loot: [{ powerupId: 'switch-solar-spiral', count: 1 }]
    },
    {
      id: 'w5',
      enemies: [
        { enemyId: 'orbit-diver', count: 31 },
        { enemyId: 'splitter', count: 29 },
        { enemyId: 'sniper-lock', count: 22 }
      ],
      loot: [{ powerupId: 'switch-flamethrower', count: 1 }]
    }
  ]
};
