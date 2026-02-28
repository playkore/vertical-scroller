import Phaser from 'phaser';
import { ShipDefinition } from '../ShipDefinition';
import { CGA_NUM } from '../../style/CgaPalette';

export const shipModule: ShipDefinition = {
  id: 'interceptor',
  name: 'INT',
  textureKey: 'ship-interceptor',
  weapon: {
    maxLevel: 5,
    fireInterval: 0.12,
    projectiles: [
      {
        offsetX: -5,
        offsetY: -11,
        textureKey: 'bullet-laser',
        behaviorId: 'linear',
        behaviorParams: {
          velocityX: 0,
          velocityY: -520
        }
      },
      {
        offsetX: 5,
        offsetY: -11,
        textureKey: 'bullet-laser',
        behaviorId: 'linear',
        behaviorParams: {
          velocityX: 0,
          velocityY: -520
        }
      }
    ]
  },
  registerAssets: (scene: Phaser.Scene) => {
    const g = scene.add.graphics();

    g.fillStyle(CGA_NUM.cyan, 1);
    g.fillTriangle(8, 0, 0, 15, 16, 15);
    g.fillStyle(CGA_NUM.white, 1);
    g.fillRect(7, 4, 2, 8);
    g.generateTexture('ship-interceptor', 16, 16);
    g.clear();

    g.fillStyle(CGA_NUM.cyan, 1);
    g.fillRect(0, 0, 2, 8);
    g.generateTexture('bullet-laser', 2, 8);

    g.destroy();
  }
};
