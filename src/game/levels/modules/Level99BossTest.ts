import { LevelDefinition } from '../LevelDefinition';

// Short boss validation level: roughly 1/10 of the normal stage duration.
export const levelModule: LevelDefinition = {
  id: 'level-99-boss-test',
  name: 'BOSS TEST',
  bossId: 'boss-alpha-core',
  waveMode: {
    spawnRatePerSecond: 2.8,
    interWaveDelaySeconds: 1.5
  },
  waves: [
    {
      id: 'w1',
      enemies: [{ enemyId: 'raider', count: 9 }],
      loot: [
        { powerupId: 'signal-scrap', count: 1 },
        { powerupId: 'switch-bulwark', count: 1 },
        { powerupId: 'switch-solar-spiral', count: 1 }
      ]
    },
    {
      id: 'w2',
      enemies: [
        { enemyId: 'raider', count: 4 },
        { enemyId: 'wave-eel', count: 3 }
      ],
      loot: [
        { powerupId: 'switch-interceptor', count: 1 },
        { powerupId: 'switch-flamethrower', count: 1 }
      ]
    },
    {
      id: 'w3',
      enemies: [
        { enemyId: 'wave-eel', count: 3 },
        { enemyId: 'saw-drift', count: 2 }
      ],
      loot: [{ powerupId: 'switch-lancer', count: 1 }]
    }
  ]
};
