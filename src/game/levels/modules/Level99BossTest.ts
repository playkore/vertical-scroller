import { LevelDefinition } from '../LevelDefinition';

// Short boss validation level: roughly 1/10 of the normal stage duration.
export const levelModule: LevelDefinition = {
  id: 'level-99-boss-test',
  name: 'BOSS TEST',
  durationSeconds: 4,
  bossId: 'boss-alpha-core',
  powerups: [
      { powerupId: 'signal-scrap', count: 1 },
      { powerupId: 'flux-battery', count: 0 },
      { powerupId: 'switch-bulwark', count: 1 },
      { powerupId: 'switch-interceptor', count: 1 },
      { powerupId: 'switch-lancer', count: 1 },
      { powerupId: 'switch-solar-spiral', count: 1 },
      { powerupId: 'switch-flamethrower', count: 1 }
    ],
  phases: [
    {
      startAt: 0,
      endAt: 2.5,
      minDelay: 0.24,
      maxDelay: 0.3,
      enemies: [{ enemyId: 'raider', weight: 1 }]
    },
    {
      startAt: 2.5,
      endAt: 4,
      minDelay: 0.2,
      maxDelay: 0.24,
      enemies: [
        { enemyId: 'raider', weight: 0.7 },
        { enemyId: 'wave-eel', weight: 0.5 }
      ]
    },
    {
      startAt: 3,
      endAt: 4,
      minDelay: 0.17,
      maxDelay: 0.2,
      enemies: [
        { enemyId: 'wave-eel', weight: 0.7 },
        { enemyId: 'saw-drift', weight: 0.6 }
      ]
    }
  ]
};
