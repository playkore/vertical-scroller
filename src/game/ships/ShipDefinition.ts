import Phaser from 'phaser';
import { BulletBehaviorDefinition, BulletBehaviorParams } from '../bullets/BulletBehavior';

export interface WeaponProjectileConfig {
  offsetX: number;
  offsetY: number;
  textureKey: string;
  scale?: number;
  behaviorId: string;
  behaviorParams?: BulletBehaviorParams;
}

export interface ShipWeaponConfig {
  fireInterval: number;
  projectiles: WeaponProjectileConfig[];
}

export interface ShipDefinition {
  id: string;
  name: string;
  textureKey: string;
  weapon: ShipWeaponConfig;
  registerAssets: (scene: Phaser.Scene) => void;
  bulletBehaviors?: BulletBehaviorDefinition[];
}
