import Phaser from 'phaser';
import { ShipDefinition } from '../ShipDefinition';

const CGA = {
  cyan: 0x55ffff,
  magenta: 0xff55ff,
  white: 0xffffff
};

export const shipModule: ShipDefinition = {
  id: 'bulwark',
  name: 'BLW',
  textureKey: 'ship-bulwark',
  weapon: {
    level: 1,
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
      },
      {
        offsetX: 0,
        offsetY: -7,
        textureKey: 'bullet-orb',
        scale: 1,
        behaviorId: 'linear',
        behaviorParams: {
          velocityX: 0,
          velocityY: -270
        }
      }
    ]
  },
  registerAssets: (scene: Phaser.Scene) => {
    const g = scene.add.graphics();

    g.fillStyle(CGA.white, 1);
    g.fillRect(1, 4, 14, 9);
    g.fillStyle(CGA.cyan, 1);
    g.fillRect(0, 7, 16, 3);
    g.fillStyle(CGA.magenta, 1);
    g.fillRect(6, 1, 4, 3);
    g.generateTexture('ship-bulwark', 16, 16);
    g.clear();

    g.fillStyle(CGA.white, 1);
    g.fillRect(1, 1, 5, 5);
    g.fillStyle(CGA.cyan, 1);
    g.fillRect(2, 2, 3, 3);
    g.generateTexture('bullet-orb', 7, 7);

    g.destroy();
  }
};
