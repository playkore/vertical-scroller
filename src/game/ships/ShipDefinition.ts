import Phaser from 'phaser';

interface BaseProjectileConfig {
  offsetX: number;
  offsetY: number;
  textureKey: string;
  scale?: number;
}

export interface LinearProjectileConfig extends BaseProjectileConfig {
  motion: 'linear';
  velocityX: number;
  velocityY: number;
}

export interface SpiralProjectileConfig extends BaseProjectileConfig {
  motion: 'spiral';
  centerVelocityX: number;
  centerVelocityY: number;
  angularSpeed: number;
  initialRadius: number;
  radiusGrowth: number;
  phase: number;
}

export type WeaponProjectileConfig = LinearProjectileConfig | SpiralProjectileConfig;

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
}
