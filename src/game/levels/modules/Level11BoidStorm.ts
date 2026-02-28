import { LevelDefinition } from '../LevelDefinition';

export const levelModule: LevelDefinition = {
  id: 'level-11',
  name: 'BOID STORM',
  durationSeconds: 18,
  bossId: null,
  powerups: [
    { powerupId: 'signal-scrap', count: 2 },
    { powerupId: 'flux-battery', count: 1 },
    { powerupId: 'switch-bulwark', count: 2 },
    { powerupId: 'switch-interceptor', count: 2 },
    { powerupId: 'switch-lancer', count: 2 },
    { powerupId: 'switch-solar-spiral', count: 2 }
  ],
  phases: [
    {
      startAt: 0,
      endAt: 18,
      minDelay: 0.38,
      maxDelay: 0.52,
      enemies: [{ enemyId: 'boid-flock', weight: 1 }]
    }
  ]
};
