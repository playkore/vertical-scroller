import { LevelDefinition } from '../LevelDefinition';

export const levelModule: LevelDefinition = {
  id: 'level-11',
  name: 'BOID STORM',
  waveMode: {
    spawnRatePerSecond: 2.2,
    interWaveDelaySeconds: 2
  },
  waves: [
    {
      id: 'w1',
      enemies: [{ enemyId: 'boid-flock', count: 40 }],
      loot: [
        { powerupId: 'signal-scrap', count: 2 },
        { powerupId: 'flux-battery', count: 1 },
        { powerupId: 'switch-bulwark', count: 2 },
        { powerupId: 'switch-interceptor', count: 2 },
        { powerupId: 'switch-lancer', count: 2 },
        { powerupId: 'switch-solar-spiral', count: 2 },
        { powerupId: 'switch-flamethrower', count: 2 }
      ]
    }
  ]
};
