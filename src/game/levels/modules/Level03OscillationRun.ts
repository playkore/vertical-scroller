import { LevelDefinition } from '../LevelDefinition';

export const levelModule: LevelDefinition = {
  id: 'level-03',
  name: 'OSCILLATION RUN',
  durationSeconds: 120,
  bossId: 'boss-alpha-core',
  powerups: [
      { powerupId: 'signal-scrap', count: 3 },
      { powerupId: 'flux-battery', count: 2 },
      { powerupId: 'switch-bulwark', count: 1 },
      { powerupId: 'switch-interceptor', count: 1 },
      { powerupId: 'switch-lancer', count: 1 },
      { powerupId: 'switch-solar-spiral', count: 1 }
    ],
  phases: [
    {
      startAt: 0,
      endAt: 24,
      minDelay: 0.38,
      maxDelay: 0.54,
      enemies: [
        { enemyId: 'raider', weight: 0.8 },
        { enemyId: 'wave-eel', weight: 0.8 },
        { enemyId: 'hunter', weight: 0.7 }
      ]
    },
    {
      startAt: 24,
      endAt: 48,
      minDelay: 0.36,
      maxDelay: 0.5,
      enemies: [
        { enemyId: 'wave-eel', weight: 0.8 },
        { enemyId: 'saw-drift', weight: 0.65 },
        { enemyId: 'hunter', weight: 0.75 },
        { enemyId: 'yoyo-striker', weight: 0.4 }
      ]
    },
    {
      startAt: 48,
      endAt: 72,
      minDelay: 0.34,
      maxDelay: 0.46,
      enemies: [
        { enemyId: 'wave-eel', weight: 0.75 },
        { enemyId: 'saw-drift', weight: 0.7 },
        { enemyId: 'hunter', weight: 0.7 },
        { enemyId: 'yoyo-striker', weight: 0.55 },
        { enemyId: 'sniper-lock', weight: 0.35 }
      ]
    },
    {
      startAt: 72,
      endAt: 96,
      minDelay: 0.3,
      maxDelay: 0.42,
      enemies: [
        { enemyId: 'hunter', weight: 0.7 },
        { enemyId: 'berserk-reaver', weight: 0.55 },
        { enemyId: 'yoyo-striker', weight: 0.8 },
        { enemyId: 'sniper-lock', weight: 0.6 }
      ]
    },
    {
      startAt: 96,
      endAt: 120,
      minDelay: 0.28,
      maxDelay: 0.4,
      enemies: [
        { enemyId: 'yoyo-striker', weight: 0.95 },
        { enemyId: 'sniper-lock', weight: 0.8 },
        { enemyId: 'saw-drift', weight: 0.65 }
      ]
    }
  ]
};
