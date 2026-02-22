import { ShipDefinition } from './ShipDefinition';

type ShipModuleImport = {
  shipModule: ShipDefinition;
};

const discoveredModules = import.meta.glob('./modules/*.ts', {
  eager: true
}) as Record<string, ShipModuleImport>;

export const SHIP_REGISTRY: ShipDefinition[] = Object.values(discoveredModules)
  .map((mod) => mod.shipModule)
  .sort((a, b) => a.name.localeCompare(b.name));

export function getDefaultShip(): ShipDefinition {
  if (SHIP_REGISTRY.length === 0) {
    throw new Error('No ship modules found in src/game/ships/modules');
  }

  return SHIP_REGISTRY[0];
}
