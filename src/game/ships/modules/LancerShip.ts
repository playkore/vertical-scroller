import Phaser from 'phaser';
import { ShipDefinition } from '../ShipDefinition';
import { CGA_NUM } from '../../style/CgaPalette';

export const shipModule: ShipDefinition = {
  id: 'lancer',
  name: 'LNC',
  textureKey: 'ship-lancer',
  weapon: {
    maxLevel: 5,
    fireInterval: (level) => {
      const maxLevel = 5;
      const clampedLevel = Phaser.Math.Clamp(level, 1, maxLevel);
      return Phaser.Math.Linear(1, 0.2, (clampedLevel - 1) / (maxLevel - 1));
    },
    projectiles: [
      {
        offsetX: -9,
        offsetY: -10,
        textureKey: 'bullet-plasma',
        behaviorId: 'linear',
        behaviorParams: {
          velocityX: -90,
          velocityY: -430
        }
      },
      {
        offsetX: 0,
        offsetY: -12,
        textureKey: 'bullet-plasma',
        scale: 1.1,
        behaviorId: 'linear',
        behaviorParams: {
          velocityX: 0,
          velocityY: -470
        }
      },
      {
        offsetX: 9,
        offsetY: -10,
        textureKey: 'bullet-plasma',
        behaviorId: 'linear',
        behaviorParams: {
          velocityX: 90,
          velocityY: -430
        }
      }
    ]
  },
  registerAssets: (scene: Phaser.Scene) => {
    const g = scene.add.graphics();

    g.fillStyle(CGA_NUM.magenta, 1);
    g.fillTriangle(8, 1, 1, 14, 15, 14);
    g.fillStyle(CGA_NUM.white, 1);
    g.fillRect(3, 8, 10, 2);
    g.fillRect(7, 3, 2, 4);
    g.generateTexture('ship-lancer', 16, 16);
    g.clear();

    g.fillStyle(CGA_NUM.magenta, 1);
    g.fillRect(1, 0, 3, 6);
    g.fillStyle(CGA_NUM.white, 1);
    g.fillRect(0, 2, 5, 2);
    g.generateTexture('bullet-plasma', 5, 6);

    g.destroy();
  }
};
