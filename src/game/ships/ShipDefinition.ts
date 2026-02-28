import Phaser from 'phaser';
import { BulletBehaviorDefinition, BulletBehaviorParams } from '../bullets/BulletBehavior';

export interface WeaponProjectileConfig {
  offsetX: number;
  offsetY: number;
  textureKey: string;
  scale?: number;
  behaviorId: string;
  behaviorParams?: BulletBehaviorParams;
  behaviorParamsPerLevel?: BulletBehaviorParams;
}

export interface ShipWeaponConfig {
  maxLevel: number;
  fireInterval: (level: number) => number;
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
