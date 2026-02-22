import Phaser from 'phaser';

// Arcade-body collider tuning for an enemy sprite.
export type EnemyColliderConfig = {
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
};

// Spawn-time randomness and placement bounds for an enemy type.
export type EnemySpawnConfig = {
  minDelay: number;
  maxDelay: number;
  minSpeed: number;
  maxSpeed: number;
  xPadding: number;
};

// Context passed once when an enemy instance is created.
export type EnemySpawnContext = {
  enemy: Phaser.Physics.Arcade.Sprite;
  scene: Phaser.Scene;
  spawnX: number;
  spawnY: number;
  initialSpeed: number;
  playfieldLeft: number;
  playfieldRight: number;
};

// Per-frame data passed to movement logic for custom behavior.
export type EnemyUpdateContext = {
  enemy: Phaser.Physics.Arcade.Sprite;
  scene: Phaser.Scene;
  deltaSeconds: number;
  ageSeconds: number;
  state: unknown;
  playfieldLeft: number;
  playfieldRight: number;
};

// Optional movement lifecycle hooks implemented by each enemy module.
export type EnemyMovementBehavior = {
  onSpawn?: (context: EnemySpawnContext) => unknown;
  onUpdate?: (context: EnemyUpdateContext) => void;
};

// Full enemy module contract consumed by the enemy registry/spawner.
export interface EnemyDefinition {
  id: string;
  name: string;
  textureKey: string;
  spawnWeight: number;
  spawn: EnemySpawnConfig;
  collider: EnemyColliderConfig;
  movement: EnemyMovementBehavior;
  registerAssets: (scene: Phaser.Scene) => void;
}
