import Phaser from 'phaser';
import { SHIP_REGISTRY } from '../ships/ShipRegistry';

const CGA = {
  cyan: 0x55ffff,
  magenta: 0xff55ff,
  white: 0xffffff
};

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create() {
    this.createShipAssets();
    this.createEnemyTexture();
    this.createStarTextures();

    this.scene.start('GameScene');
  }

  private createShipAssets() {
    SHIP_REGISTRY.forEach((ship) => {
      ship.registerAssets(this);
    });
  }

  private createEnemyTexture() {
    const g = this.add.graphics();
    g.fillStyle(CGA.magenta, 1);
    g.fillRect(2, 2, 12, 10);
    g.fillStyle(CGA.white, 1);
    g.fillRect(6, 0, 4, 2);
    g.fillRect(4, 12, 8, 2);
    g.generateTexture('enemy-ship', 16, 16);
    g.clear();
    g.destroy();
  }

  private createStarTextures() {
    const g = this.add.graphics();
    g.fillStyle(CGA.white, 1);
    g.fillRect(0, 0, 1, 1);
    g.generateTexture('star-small', 1, 1);
    g.clear();

    g.fillStyle(CGA.cyan, 1);
    g.fillRect(0, 0, 2, 2);
    g.generateTexture('star-medium', 2, 2);
    g.clear();

    g.fillStyle(CGA.magenta, 1);
    g.fillRect(0, 0, 3, 3);
    g.generateTexture('star-large', 3, 3);
    g.destroy();
  }
}
