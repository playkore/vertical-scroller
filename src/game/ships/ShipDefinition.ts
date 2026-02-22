import Phaser from 'phaser';

export interface WeaponProjectileConfig {
  offsetX: number;
  offsetY: number;
  velocityX: number;
  velocityY: number;
  textureKey: string;
  scale?: number;
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
}
