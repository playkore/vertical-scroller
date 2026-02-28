import Phaser from 'phaser';
import { ShipDefinition } from '../ShipDefinition';
import { CGA_NUM } from '../../style/CgaPalette';

export const shipModule: ShipDefinition = {
  id: 'bulwark',
  name: 'BLW',
  textureKey: 'ship-bulwark',
  weapon: {
    maxLevel: 12,
    fireInterval: 0.32,
    projectiles: [
      {
        offsetX: 0,
        offsetY: -13,
        textureKey: 'bullet-orb',
        scale: 1.25,
        behaviorId: 'linear',
        behaviorParams: {
          velocityX: 0,
          velocityY: -320
        }
      }
    ]
  },
  registerAssets: (scene: Phaser.Scene) => {
    const g = scene.add.graphics();

    g.fillStyle(CGA_NUM.white, 1);
    g.fillRect(1, 4, 14, 9);
    g.fillStyle(CGA_NUM.cyan, 1);
    g.fillRect(0, 7, 16, 3);
    g.fillStyle(CGA_NUM.magenta, 1);
    g.fillRect(6, 1, 4, 3);
    g.generateTexture('ship-bulwark', 16, 16);
    g.clear();

    g.fillStyle(CGA_NUM.white, 1);
    g.fillRect(1, 1, 5, 5);
    g.fillStyle(CGA_NUM.cyan, 1);
    g.fillRect(2, 2, 3, 3);
    g.generateTexture('bullet-orb', 7, 7);

    g.destroy();
  }
};
