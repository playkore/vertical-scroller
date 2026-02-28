import { LevelDefinition } from '../LevelDefinition';

export const levelModule: LevelDefinition = {
  id: 'level-01',
  name: 'NEON FRONTIER',
  perfectKillThreshold: 1,
  waveMode: {
    spawnRatePerSecond: 1.8,
    interWaveDelaySeconds: 3
  },
  waves: [
    {
      id: 'w1',
      enemies: [{ enemyId: 'raider', count: 18 }],
      loot: [{ powerupId: 'switch-bulwark', count: 2 }]
    },
    {
      id: 'w2',
      enemies: [
        { enemyId: 'raider', count: 12 },
        { enemyId: 'wave-eel', count: 7 }
      ],
      loot: [{ powerupId: 'switch-bulwark', count: 2 }]
    },
    {
      id: 'w3',
      enemies: [
        { enemyId: 'raider', count: 8 },
        { enemyId: 'wave-eel', count: 8 },
        { enemyId: 'saw-drift', count: 5 }
      ],
      loot: [{ powerupId: 'switch-bulwark', count: 2 }]
    },
    {
      id: 'w4',
      enemies: [
        { enemyId: 'wave-eel', count: 11 },
        { enemyId: 'saw-drift', count: 9 },
        { enemyId: 'raider', count: 4 }
      ],
      loot: [{ powerupId: 'switch-bulwark', count: 1 }]
    },
    {
      id: 'w5',
      enemies: [
        { enemyId: 'wave-eel', count: 13 },
        { enemyId: 'saw-drift', count: 13 }
      ],
      loot: [{ powerupId: 'switch-bulwark', count: 1 }]
    }
  ]
};
