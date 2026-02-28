import { LevelDefinition } from '../LevelDefinition';

export const levelModule: LevelDefinition = {
  id: 'level-04',
  name: 'DIVER SPLIT',
  durationSeconds: 135,
  bossId: 'boss-alpha-core',
  powerups: [
      { powerupId: 'signal-scrap', count: 3 },
      { powerupId: 'flux-battery', count: 3 },
      { powerupId: 'switch-bulwark', count: 1 },
      { powerupId: 'switch-interceptor', count: 1 },
      { powerupId: 'switch-lancer', count: 1 },
      { powerupId: 'switch-solar-spiral', count: 1 },
      { powerupId: 'switch-flamethrower', count: 1 }
    ],
  phases: [
    {
      startAt: 0,
      endAt: 27,
      minDelay: 0.38,
      maxDelay: 0.5,
      enemies: [
        { enemyId: 'wave-eel', weight: 0.8 },
        { enemyId: 'hunter', weight: 0.75 },
        { enemyId: 'yoyo-striker', weight: 0.6 }
      ]
    },
    {
      startAt: 27,
      endAt: 54,
      minDelay: 0.34,
      maxDelay: 0.46,
      enemies: [
        { enemyId: 'saw-drift', weight: 0.75 },
        { enemyId: 'hunter', weight: 0.7 },
        { enemyId: 'yoyo-striker', weight: 0.7 },
        { enemyId: 'orbit-diver', weight: 0.4 }
      ]
    },
    {
      startAt: 54,
      endAt: 81,
      minDelay: 0.32,
      maxDelay: 0.44,
      enemies: [
        { enemyId: 'hunter', weight: 0.65 },
        { enemyId: 'yoyo-striker', weight: 0.75 },
        { enemyId: 'sniper-lock', weight: 0.55 },
        { enemyId: 'orbit-diver', weight: 0.55 },
        { enemyId: 'splitter', weight: 0.4 }
      ]
    },
    {
      startAt: 81,
      endAt: 108,
      minDelay: 0.3,
      maxDelay: 0.42,
      enemies: [
        { enemyId: 'sniper-lock', weight: 0.65 },
        { enemyId: 'orbit-diver', weight: 0.75 },
        { enemyId: 'splitter', weight: 0.65 },
        { enemyId: 'berserk-reaver', weight: 0.45 }
      ]
    },
    {
      startAt: 108,
      endAt: 135,
      minDelay: 0.26,
      maxDelay: 0.4,
      enemies: [
        { enemyId: 'orbit-diver', weight: 0.9 },
        { enemyId: 'splitter', weight: 0.85 },
        { enemyId: 'sniper-lock', weight: 0.65 }
      ]
    }
  ]
};
