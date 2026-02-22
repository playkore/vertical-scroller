import Phaser from 'phaser';
import { ENEMY_REGISTRY } from '../enemies/EnemyRegistry';
import { SHIP_REGISTRY } from '../ships/ShipRegistry';
import { CGA_NUM } from '../style/CgaPalette';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create() {
    this.createShipAssets();
    this.createEnemyAssets();
    this.createStarTextures();

    this.scene.start('GameScene');
  }

  private createShipAssets() {
    SHIP_REGISTRY.forEach((ship) => {
      ship.registerAssets(this);
    });
  }

  private createEnemyAssets() {
    ENEMY_REGISTRY.forEach((enemy) => {
      enemy.registerAssets(this);
    });
  }

  private createStarTextures() {
    const g = this.add.graphics();
    g.fillStyle(CGA_NUM.white, 1);
    g.fillRect(0, 0, 1, 1);
    g.generateTexture('star-small', 1, 1);
    g.clear();

    g.fillStyle(CGA_NUM.cyan, 1);
    g.fillRect(0, 0, 2, 2);
    g.generateTexture('star-medium', 2, 2);
    g.clear();

    g.fillStyle(CGA_NUM.magenta, 1);
    g.fillRect(0, 0, 3, 3);
    g.generateTexture('star-large', 3, 3);
    g.destroy();
  }
}
