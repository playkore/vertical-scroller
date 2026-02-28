import { LevelDefinition } from '../LevelDefinition';

export const levelModule: LevelDefinition = {
  id: 'level-05',
  name: 'ARMOR PULSE',
  durationSeconds: 135,
  bossId: 'boss-alpha-core',
  powerups: [
      { powerupId: 'signal-scrap', count: 4 },
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
      minDelay: 0.34,
      maxDelay: 0.46,
      enemies: [
        { enemyId: 'hunter', weight: 0.75 },
        { enemyId: 'splitter', weight: 0.65 },
        { enemyId: 'orbit-diver', weight: 0.6 }
      ]
    },
    {
      startAt: 27,
      endAt: 54,
      minDelay: 0.32,
      maxDelay: 0.44,
      enemies: [
        { enemyId: 'splitter', weight: 0.75 },
        { enemyId: 'sniper-lock', weight: 0.6 },
        { enemyId: 'orbit-diver', weight: 0.65 },
        { enemyId: 'shield-front', weight: 0.42 }
      ]
    },
    {
      startAt: 54,
      endAt: 81,
      minDelay: 0.3,
      maxDelay: 0.42,
      enemies: [
        { enemyId: 'orbit-diver', weight: 0.65 },
        { enemyId: 'splitter', weight: 0.7 },
        { enemyId: 'shield-front', weight: 0.6 },
        { enemyId: 'pulse-ram', weight: 0.45 },
        { enemyId: 'yoyo-striker', weight: 0.5 }
      ]
    },
    {
      startAt: 81,
      endAt: 108,
      minDelay: 0.28,
      maxDelay: 0.4,
      enemies: [
        { enemyId: 'shield-front', weight: 0.75 },
        { enemyId: 'pulse-ram', weight: 0.7 },
        { enemyId: 'sniper-lock', weight: 0.6 },
        { enemyId: 'hunter', weight: 0.5 }
      ]
    },
    {
      startAt: 108,
      endAt: 135,
      minDelay: 0.24,
      maxDelay: 0.38,
      enemies: [
        { enemyId: 'pulse-ram', weight: 0.9 },
        { enemyId: 'shield-front', weight: 0.8 },
        { enemyId: 'splitter', weight: 0.65 }
      ]
    }
  ]
};
