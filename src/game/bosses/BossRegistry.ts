import { BossDefinition } from './BossDefinition';

type BossModuleImport = {
  bossModule: BossDefinition;
};

const discoveredModules = import.meta.glob('./modules/*.ts', {
  eager: true
}) as Record<string, BossModuleImport>;

export const BOSS_REGISTRY: BossDefinition[] = Object.values(discoveredModules)
  .map((mod) => mod.bossModule)
  .sort((a, b) => a.name.localeCompare(b.name));

const bossById = new Map<string, BossDefinition>(BOSS_REGISTRY.map((boss) => [boss.id, boss]));

export function getBossById(bossId: string): BossDefinition {
  const boss = bossById.get(bossId);
  if (!boss) {
    throw new Error(`Unknown boss id in level config: ${bossId}`);
  }

  return boss;
}
