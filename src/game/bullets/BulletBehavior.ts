import Phaser from 'phaser';

export type BulletBehaviorParams = Record<string, number>;

export interface BulletBehaviorFireContext {
  bullet: Phaser.Physics.Arcade.Image;
  scene: Phaser.Scene;
  spawnX: number;
  spawnY: number;
  params: BulletBehaviorParams;
}

export interface BulletBehaviorUpdateContext {
  bullet: Phaser.Physics.Arcade.Image;
  scene: Phaser.Scene;
  deltaSeconds: number;
  state: unknown;
}

export interface BulletBehaviorDefinition {
  id: string;
  onFire: (context: BulletBehaviorFireContext) => unknown;
  onUpdate?: (context: BulletBehaviorUpdateContext) => void;
}
