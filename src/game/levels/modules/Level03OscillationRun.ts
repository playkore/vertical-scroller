import { LevelDefinition } from '../LevelDefinition';

export const levelModule: LevelDefinition = {
  id: 'level-03',
  name: 'OSCILLATION RUN',
  bossId: 'boss-alpha-core',
  waveMode: {
    spawnRatePerSecond: 2.5,
    interWaveDelaySeconds: 3
  },
  waves: [
    {
      id: 'w1',
      enemies: [
        { enemyId: 'raider', count: 18 },
        { enemyId: 'wave-eel', count: 18 },
        { enemyId: 'hunter', count: 16 }
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
        { enemyId: 'wave-eel', count: 17 },
        { enemyId: 'saw-drift', count: 14 },
        { enemyId: 'hunter', count: 16 },
        { enemyId: 'yoyo-striker', count: 9 }
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
        { enemyId: 'wave-eel', count: 14 },
        { enemyId: 'saw-drift', count: 14 },
        { enemyId: 'hunter', count: 14 },
        { enemyId: 'yoyo-striker', count: 11 },
        { enemyId: 'sniper-lock', count: 7 }
      ],
      loot: [
        { powerupId: 'signal-scrap', count: 1 },
        { powerupId: 'switch-lancer', count: 1 }
      ]
    },
    {
      id: 'w4',
      enemies: [
        { enemyId: 'hunter', count: 18 },
        { enemyId: 'berserk-reaver', count: 14 },
        { enemyId: 'yoyo-striker', count: 20 },
        { enemyId: 'sniper-lock', count: 15 }
      ],
      loot: [{ powerupId: 'switch-solar-spiral', count: 1 }]
    },
    {
      id: 'w5',
      enemies: [
        { enemyId: 'yoyo-striker', count: 28 },
        { enemyId: 'sniper-lock', count: 24 },
        { enemyId: 'saw-drift', count: 19 }
      ],
      loot: [{ powerupId: 'switch-flamethrower', count: 1 }]
    }
  ]
};
