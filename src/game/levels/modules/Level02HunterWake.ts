import { LevelDefinition } from '../LevelDefinition';

export const levelModule: LevelDefinition = {
  id: 'level-02',
  name: 'HUNTER WAKE',
  bossId: 'boss-alpha-core',
  waveMode: {
    spawnRatePerSecond: 2.1,
    interWaveDelaySeconds: 3
  },
  waves: [
    {
      id: 'w1',
      enemies: [
        { enemyId: 'raider', count: 29 },
        { enemyId: 'wave-eel', count: 14 }
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
        { enemyId: 'raider', count: 15 },
        { enemyId: 'wave-eel', count: 13 },
        { enemyId: 'saw-drift', count: 10 },
        { enemyId: 'hunter', count: 8 }
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
        { enemyId: 'raider', count: 11 },
        { enemyId: 'wave-eel', count: 11 },
        { enemyId: 'saw-drift', count: 11 },
        { enemyId: 'hunter', count: 11 },
        { enemyId: 'berserk-reaver', count: 6 }
      ],
      loot: [{ powerupId: 'switch-lancer', count: 1 }]
    },
    {
      id: 'w4',
      enemies: [
        { enemyId: 'wave-eel', count: 15 },
        { enemyId: 'saw-drift', count: 14 },
        { enemyId: 'hunter', count: 15 },
        { enemyId: 'berserk-reaver', count: 11 }
      ],
      loot: [{ powerupId: 'switch-solar-spiral', count: 1 }]
    },
    {
      id: 'w5',
      enemies: [
        { enemyId: 'hunter', count: 24 },
        { enemyId: 'berserk-reaver', count: 20 },
        { enemyId: 'saw-drift', count: 16 }
      ],
      loot: [{ powerupId: 'switch-flamethrower', count: 1 }]
    }
  ]
};
