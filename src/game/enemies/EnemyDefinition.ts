import Phaser from 'phaser';

export type EnemyColliderConfig = {
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
};

export type EnemySpawnConfig = {
  minDelay: number;
  maxDelay: number;
  minSpeed: number;
  maxSpeed: number;
  xPadding: number;
};

export type EnemySpawnContext = {
  enemy: Phaser.Physics.Arcade.Sprite;
  scene: Phaser.Scene;
  spawnX: number;
  spawnY: number;
  initialSpeed: number;
  playfieldLeft: number;
  playfieldRight: number;
};

export type EnemyUpdateContext = {
  enemy: Phaser.Physics.Arcade.Sprite;
  scene: Phaser.Scene;
  deltaSeconds: number;
  ageSeconds: number;
  state: unknown;
  playfieldLeft: number;
  playfieldRight: number;
};

export type EnemyMovementBehavior = {
  onSpawn?: (context: EnemySpawnContext) => unknown;
  onUpdate?: (context: EnemyUpdateContext) => void;
};

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
