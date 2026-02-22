import { SHIP_REGISTRY } from '../ships/ShipRegistry';
import { BulletBehaviorDefinition } from './BulletBehavior';

type BulletModuleImport = {
  bulletBehavior: BulletBehaviorDefinition;
};

const discoveredModules = import.meta.glob('./modules/*.ts', {
  eager: true
}) as Record<string, BulletModuleImport>;

const registryMap = new Map<string, BulletBehaviorDefinition>();

for (const modulePath of Object.keys(discoveredModules)) {
  const behavior = discoveredModules[modulePath].bulletBehavior;
  registryMap.set(behavior.id, behavior);
}

for (const ship of SHIP_REGISTRY) {
  for (const behavior of ship.bulletBehaviors ?? []) {
    if (registryMap.has(behavior.id)) {
      throw new Error(`Duplicate bullet behavior id detected: ${behavior.id}`);
    }

    registryMap.set(behavior.id, behavior);
  }
}

export function getBulletBehavior(behaviorId: string): BulletBehaviorDefinition {
  const behavior = registryMap.get(behaviorId);
  if (!behavior) {
    throw new Error(`Unknown bullet behavior: ${behaviorId}`);
  }

  return behavior;
}
