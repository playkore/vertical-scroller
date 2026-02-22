import Phaser from 'phaser';

// Boss collider shape used for Arcade overlap hit-box setup.
export type BossColliderConfig = {
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
};

// Runtime context passed to boss movement when the boss is spawned.
export type BossSpawnContext = {
  boss: Phaser.Physics.Arcade.Sprite;
  scene: Phaser.Scene;
  spawnX: number;
  spawnY: number;
  playfieldLeft: number;
  playfieldRight: number;
};

// Runtime context passed each frame to update boss movement logic.
export type BossUpdateContext = {
  boss: Phaser.Physics.Arcade.Sprite;
  scene: Phaser.Scene;
  deltaSeconds: number;
  ageSeconds: number;
  state: unknown;
  playfieldLeft: number;
  playfieldRight: number;
};

// Boss movement behavior hooks. Each boss module owns this logic.
export type BossMovementBehavior = {
  onSpawn?: (context: BossSpawnContext) => unknown;
  onUpdate?: (context: BossUpdateContext) => void;
};

// Complete boss module contract. Add new bosses by implementing this interface.
export interface BossDefinition {
  id: string;
  name: string;
  textureKey: string;
  health: number;
  collider: BossColliderConfig;
  movement: BossMovementBehavior;
  registerAssets: (scene: Phaser.Scene) => void;
}
