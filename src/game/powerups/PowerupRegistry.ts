import { PowerupDefinition } from './PowerupDefinition';

type PowerupModuleImport = {
  powerupModule: PowerupDefinition;
};

const discoveredModules = import.meta.glob('./modules/*.ts', {
  eager: true
}) as Record<string, PowerupModuleImport>;

export const POWERUP_REGISTRY: PowerupDefinition[] = Object.values(discoveredModules)
  .map((mod) => mod.powerupModule)
  .sort((a, b) => a.name.localeCompare(b.name));

const powerupById = new Map<string, PowerupDefinition>(POWERUP_REGISTRY.map((powerup) => [powerup.id, powerup]));

export function getPowerupById(powerupId: string): PowerupDefinition {
  const powerup = powerupById.get(powerupId);
  if (!powerup) {
    throw new Error(`Unknown powerup id in level config: ${powerupId}`);
  }

  return powerup;
}
