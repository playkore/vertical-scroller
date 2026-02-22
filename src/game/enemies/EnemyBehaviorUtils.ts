import Phaser from 'phaser';

type RuntimePlayerLike = {
  x: number;
  y: number;
  active?: boolean;
};

// GameScene keeps a runtime `player` instance; enemy modules use this helper
// so movement logic can track the player without hard-coupling to scene types.
export function getPlayerPosition(scene: Phaser.Scene): Phaser.Math.Vector2 | null {
  const runtimePlayer = (scene as { player?: unknown }).player;
  if (!runtimePlayer || typeof runtimePlayer !== 'object') {
    return null;
  }

  const player = runtimePlayer as Partial<RuntimePlayerLike>;
  if (typeof player.x !== 'number' || typeof player.y !== 'number') {
    return null;
  }

  if (player.active === false) {
    return null;
  }

  return new Phaser.Math.Vector2(player.x, player.y);
}

export function getTargetX(scene: Phaser.Scene, fallbackX: number): number {
  return getPlayerPosition(scene)?.x ?? fallbackX;
}

export function approach(current: number, target: number, maxDelta: number): number {
  if (current < target) {
    return Math.min(current + maxDelta, target);
  }

  return Math.max(current - maxDelta, target);
}
