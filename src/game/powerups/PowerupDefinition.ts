import Phaser from 'phaser';
import { PlayerShip } from '../objects/PlayerShip';

// Runtime behavior hook invoked when player collects a pickup.
export type PowerupOnCollect = {
  onCollect: (context: { scene: Phaser.Scene; player: PlayerShip }) => void;
};

// Full powerup module contract consumed by the powerup registry/drop systems.
export interface PowerupDefinition {
  id: string;
  name: string;
  textureKey: string;
  // Downward travel speed after the pickup spawns from a destroyed enemy.
  fallSpeed: number;
  behavior: PowerupOnCollect;
  registerAssets: (scene: Phaser.Scene) => void;
}
