import { LevelDefinition } from '../LevelDefinition';

export const levelModule: LevelDefinition = {
  id: 'level-02',
  name: 'HUNTER WAKE',
  durationSeconds: 120,
  bossId: 'boss-alpha-core',
  phases: [
    {
      startAt: 0,
      endAt: 24,
      minDelay: 0.48,
      maxDelay: 0.64,
      enemies: [
        { enemyId: 'raider', weight: 1 },
        { enemyId: 'wave-eel', weight: 0.5 }
      ]
    },
    {
      startAt: 24,
      endAt: 48,
      minDelay: 0.44,
      maxDelay: 0.6,
      enemies: [
        { enemyId: 'raider', weight: 0.8 },
        { enemyId: 'wave-eel', weight: 0.7 },
        { enemyId: 'saw-drift', weight: 0.55 },
        { enemyId: 'hunter', weight: 0.4 }
      ]
    },
    {
      startAt: 48,
      endAt: 72,
      minDelay: 0.4,
      maxDelay: 0.56,
      enemies: [
        { enemyId: 'raider', weight: 0.65 },
        { enemyId: 'wave-eel', weight: 0.7 },
        { enemyId: 'saw-drift', weight: 0.7 },
        { enemyId: 'hunter', weight: 0.65 },
        { enemyId: 'berserk-reaver', weight: 0.35 }
      ]
    },
    {
      startAt: 72,
      endAt: 96,
      minDelay: 0.36,
      maxDelay: 0.52,
      enemies: [
        { enemyId: 'wave-eel', weight: 0.75 },
        { enemyId: 'saw-drift', weight: 0.75 },
        { enemyId: 'hunter', weight: 0.8 },
        { enemyId: 'berserk-reaver', weight: 0.55 }
      ]
    },
    {
      startAt: 96,
      endAt: 120,
      minDelay: 0.32,
      maxDelay: 0.48,
      enemies: [
        { enemyId: 'hunter', weight: 0.95 },
        { enemyId: 'berserk-reaver', weight: 0.8 },
        { enemyId: 'saw-drift', weight: 0.65 }
      ]
    }
  ]
};
