import Phaser from 'phaser';
import { ShipDefinition } from '../ShipDefinition';

const CGA = {
  cyan: 0x55ffff,
  white: 0xffffff
};

export const shipModule: ShipDefinition = {
  id: 'interceptor',
  name: 'INT',
  textureKey: 'ship-interceptor',
  weapon: {
    fireInterval: 0.12,
    projectiles: [
      {
        offsetX: -5,
        offsetY: -11,
        velocityX: 0,
        velocityY: -520,
        textureKey: 'bullet-laser'
      },
      {
        offsetX: 5,
        offsetY: -11,
        velocityX: 0,
        velocityY: -520,
        textureKey: 'bullet-laser'
      }
    ]
  },
  registerAssets: (scene: Phaser.Scene) => {
    const g = scene.add.graphics();

    g.fillStyle(CGA.cyan, 1);
    g.fillTriangle(8, 0, 0, 15, 16, 15);
    g.fillStyle(CGA.white, 1);
    g.fillRect(7, 4, 2, 8);
    g.generateTexture('ship-interceptor', 16, 16);
    g.clear();

    g.fillStyle(CGA.cyan, 1);
    g.fillRect(0, 0, 2, 8);
    g.generateTexture('bullet-laser', 2, 8);

    g.destroy();
  }
};
