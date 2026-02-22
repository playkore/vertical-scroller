import { LevelDefinition } from '../LevelDefinition';

// Short boss validation level: roughly 1/10 of the normal stage duration.
export const levelModule: LevelDefinition = {
  id: 'level-99-boss-test',
  name: 'BOSS TEST',
  durationSeconds: 4,
  bossId: 'boss-alpha-core',
  phases: [
    {
      startAt: 0,
      endAt: 2.5,
      minDelay: 1.2,
      maxDelay: 1.5,
      enemies: [{ enemyId: 'raider', weight: 1 }]
    },
    {
      startAt: 2.5,
      endAt: 4,
      minDelay: 1,
      maxDelay: 1.2,
      enemies: [
        { enemyId: 'raider', weight: 0.7 },
        { enemyId: 'wave-eel', weight: 0.5 }
      ]
    },
    {
      startAt: 3,
      endAt: 4,
      minDelay: 0.85,
      maxDelay: 1,
      enemies: [
        { enemyId: 'wave-eel', weight: 0.7 },
        { enemyId: 'saw-drift', weight: 0.6 }
      ]
    }
  ]
};
