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

const enemyById = new Map<string, EnemyDefinition>(ENEMY_REGISTRY.map((enemy) => [enemy.id, enemy]));

export function getEnemyById(enemyId: string): EnemyDefinition {
  const enemy = enemyById.get(enemyId);
  if (!enemy) {
    throw new Error(`Unknown enemy id in level config: ${enemyId}`);
  }

  return enemy;
}
