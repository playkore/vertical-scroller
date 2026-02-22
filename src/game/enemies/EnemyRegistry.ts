import { EnemyDefinition } from './EnemyDefinition';

type EnemyModuleImport = {
  enemyModule: EnemyDefinition;
};

const discoveredModules = import.meta.glob('./modules/*.ts', {
  eager: true
}) as Record<string, EnemyModuleImport>;

export const ENEMY_REGISTRY: EnemyDefinition[] = Object.values(discoveredModules)
  .map((mod) => mod.enemyModule)
  .sort((a, b) => a.name.localeCompare(b.name));

export function getWeightedRandomEnemy(): EnemyDefinition {
  if (ENEMY_REGISTRY.length === 0) {
    throw new Error('No enemy modules found in src/game/enemies/modules');
  }

  const totalWeight = ENEMY_REGISTRY.reduce((sum, enemy) => sum + enemy.spawnWeight, 0);
  let roll = Math.random() * totalWeight;

  for (const enemy of ENEMY_REGISTRY) {
    roll -= enemy.spawnWeight;
    if (roll <= 0) {
      return enemy;
    }
  }

  return ENEMY_REGISTRY[ENEMY_REGISTRY.length - 1];
}
