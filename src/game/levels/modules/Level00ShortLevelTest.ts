import { LevelDefinition } from '../LevelDefinition';

// Ultra-short validation level for boss flow and transition testing.
export const levelModule: LevelDefinition = {
  id: 'level-00-short-level-test',
  name: 'SHORT LEVEL TEST',
  durationSeconds: 4,
  bossId: 'boss-tiny-core',
  phases: [
    {
      startAt: 0,
      endAt: 2,
      minDelay: 1,
      maxDelay: 1.3,
      enemies: [{ enemyId: 'raider', weight: 1 }]
    },
    {
      startAt: 2,
      endAt: 4,
      minDelay: 0.8,
      maxDelay: 1,
      enemies: [
        { enemyId: 'raider', weight: 0.7 },
        { enemyId: 'wave-eel', weight: 0.5 }
      ]
    }
  ]
};
