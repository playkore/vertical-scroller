import Phaser from 'phaser';
import { ShipDefinition } from '../ShipDefinition';

const COLORS = {
  yellow: 0xffff55,
  white: 0xffffff,
  amber: 0xffaa00
};

export const shipModule: ShipDefinition = {
  id: 'solar-spiral',
  name: 'SUN',
  textureKey: 'ship-solar-spiral',
  weapon: {
    fireInterval: 0.24,
    projectiles: [
      {
        motion: 'spiral',
        offsetX: 0,
        offsetY: -11,
        centerVelocityX: 0,
        centerVelocityY: -230,
        angularSpeed: 11,
        initialRadius: 2,
        radiusGrowth: 24,
        phase: 0,
        textureKey: 'bullet-solar-spiral',
        scale: 0.95
      },
      {
        motion: 'spiral',
        offsetX: 0,
        offsetY: -11,
        centerVelocityX: 0,
        centerVelocityY: -230,
        angularSpeed: -11,
        initialRadius: 2,
        radiusGrowth: 24,
        phase: 3.14159,
        textureKey: 'bullet-solar-spiral',
        scale: 0.95
      }
    ]
  },
  registerAssets: (scene: Phaser.Scene) => {
    const g = scene.add.graphics();

    g.fillStyle(COLORS.yellow, 1);
    g.fillTriangle(8, 0, 1, 15, 15, 15);
    g.fillStyle(COLORS.white, 1);
    g.fillRect(7, 5, 2, 6);
    g.fillStyle(COLORS.amber, 1);
    g.fillRect(5, 12, 6, 2);
    g.generateTexture('ship-solar-spiral', 16, 16);
    g.clear();

    g.fillStyle(COLORS.yellow, 1);
    g.fillRect(1, 1, 4, 4);
    g.fillStyle(COLORS.white, 1);
    g.fillRect(2, 2, 2, 2);
    g.generateTexture('bullet-solar-spiral', 6, 6);

    g.destroy();
  }
};
