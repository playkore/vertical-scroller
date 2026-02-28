import Phaser from 'phaser';

type RuntimePlayerLike = {
  x: number;
  y: number;
  active?: boolean;
};

type VerticalLoopState = {
  hasEnteredPlayfield: boolean;
  direction: 1 | -1;
};

const VERTICAL_LOOP_STATE_KEY = 'verticalLoopState';

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

export function resetVerticalLoopState(enemy: Phaser.Physics.Arcade.Sprite) {
  enemy.setData(VERTICAL_LOOP_STATE_KEY, {
    hasEnteredPlayfield: false,
    direction: 1
  } satisfies VerticalLoopState);
}

export function moveEnemyVertically(
  enemy: Phaser.Physics.Arcade.Sprite,
  deltaY: number,
  sceneHeight: number
) {
  let loopState = enemy.getData(VERTICAL_LOOP_STATE_KEY) as VerticalLoopState | undefined;
  if (!loopState) {
    loopState = {
      hasEnteredPlayfield: false,
      direction: 1
    };
    enemy.setData(VERTICAL_LOOP_STATE_KEY, loopState);
  }

  const halfHeight = Math.max(8, enemy.displayHeight * 0.5);
  const minY = halfHeight;
  const maxY = sceneHeight - halfHeight;

  if (!loopState.hasEnteredPlayfield) {
    enemy.y += deltaY;
    if (enemy.y >= minY) {
      loopState.hasEnteredPlayfield = true;
      enemy.y = Math.max(enemy.y, minY);
    }
    return;
  }

  let nextY = enemy.y + (deltaY * loopState.direction);

  if (nextY > maxY) {
    loopState.direction = -1;
    nextY = enemy.y + (deltaY * loopState.direction);
  } else if (nextY < minY) {
    loopState.direction = 1;
    nextY = enemy.y + (deltaY * loopState.direction);
  }

  enemy.y = Phaser.Math.Clamp(nextY, minY, maxY);
}
