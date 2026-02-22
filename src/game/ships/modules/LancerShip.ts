import Phaser from 'phaser';
import { ShipDefinition } from '../ShipDefinition';

const CGA = {
  magenta: 0xff55ff,
  white: 0xffffff
};

export const shipModule: ShipDefinition = {
  id: 'lancer',
  name: 'LNC',
  textureKey: 'ship-lancer',
  weapon: {
    fireInterval: 0.2,
    projectiles: [
      {
        motion: 'linear',
        offsetX: -9,
        offsetY: -10,
        velocityX: -90,
        velocityY: -430,
        textureKey: 'bullet-plasma'
      },
      {
        motion: 'linear',
        offsetX: 0,
        offsetY: -12,
        velocityX: 0,
        velocityY: -470,
        textureKey: 'bullet-plasma',
        scale: 1.1
      },
      {
        motion: 'linear',
        offsetX: 9,
        offsetY: -10,
        velocityX: 90,
        velocityY: -430,
        textureKey: 'bullet-plasma'
      }
    ]
  },
  registerAssets: (scene: Phaser.Scene) => {
    const g = scene.add.graphics();

    g.fillStyle(CGA.magenta, 1);
    g.fillTriangle(8, 1, 1, 14, 15, 14);
    g.fillStyle(CGA.white, 1);
    g.fillRect(3, 8, 10, 2);
    g.fillRect(7, 3, 2, 4);
    g.generateTexture('ship-lancer', 16, 16);
    g.clear();

    g.fillStyle(CGA.magenta, 1);
    g.fillRect(1, 0, 3, 6);
    g.fillStyle(CGA.white, 1);
    g.fillRect(0, 2, 5, 2);
    g.generateTexture('bullet-plasma', 5, 6);

    g.destroy();
  }
};
