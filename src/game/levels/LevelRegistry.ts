import { LevelDefinition } from './LevelDefinition';

type LevelModuleImport = {
  levelModule: LevelDefinition;
};

const discoveredModules = import.meta.glob('./modules/*.ts', {
  eager: true
}) as Record<string, LevelModuleImport>;

export const LEVEL_REGISTRY: LevelDefinition[] = Object.values(discoveredModules)
  .map((mod) => mod.levelModule)
  .sort((a, b) => a.id.localeCompare(b.id));

const levelById = new Map<string, LevelDefinition>(LEVEL_REGISTRY.map((level) => [level.id, level]));

export function getDefaultLevel(): LevelDefinition {
  if (LEVEL_REGISTRY.length === 0) {
    throw new Error('No level modules found in src/game/levels/modules');
  }

  return LEVEL_REGISTRY[0];
}

export function getLevelById(levelId: string): LevelDefinition {
  const level = levelById.get(levelId);
  if (!level) {
    throw new Error(`Unknown level id: ${levelId}`);
  }

  return level;
}
