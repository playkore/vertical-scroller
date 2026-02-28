import { LevelDefinition } from '../LevelDefinition';

export const levelModule: LevelDefinition = {
  id: 'level-01',
  name: 'NEON FRONTIER',
  durationSeconds: 105,
  bossId: 'boss-alpha-core',
  powerups: [
      { powerupId: 'signal-scrap', count: 2 },
      { powerupId: 'flux-battery', count: 1 },
      { powerupId: 'switch-bulwark', count: 8 },
      { powerupId: 'switch-interceptor', count: 8 },
      { powerupId: 'switch-lancer', count: 8 },
      { powerupId: 'switch-solar-spiral', count: 8 },
      { powerupId: 'switch-flamethrower', count: 80 }
    ],
  phases: [
    {
      startAt: 0,
      endAt: 24,
      minDelay: 0.6,
      maxDelay: 0.76,
      enemies: [{ enemyId: 'raider', weight: 1 }]
    },
    {
      startAt: 24,
      endAt: 48,
      minDelay: 0.52,
      maxDelay: 0.68,
      enemies: [
        { enemyId: 'raider', weight: 0.9 },
        { enemyId: 'wave-eel', weight: 0.55 }
      ]
    },
    {
      startAt: 48,
      endAt: 72,
      minDelay: 0.48,
      maxDelay: 0.64,
      enemies: [
        { enemyId: 'raider', weight: 0.75 },
        { enemyId: 'wave-eel', weight: 0.7 },
        { enemyId: 'saw-drift', weight: 0.45 }
      ]
    },
    {
      startAt: 72,
      endAt: 93,
      minDelay: 0.44,
      maxDelay: 0.58,
      enemies: [
        { enemyId: 'wave-eel', weight: 0.9 },
        { enemyId: 'saw-drift', weight: 0.85 },
        { enemyId: 'raider', weight: 0.45 }
      ]
    },
    {
      startAt: 93,
      endAt: 105,
      minDelay: 0.4,
      maxDelay: 0.52,
      enemies: [
        { enemyId: 'wave-eel', weight: 1 },
        { enemyId: 'saw-drift', weight: 1 }
      ]
    }
  ]
};
