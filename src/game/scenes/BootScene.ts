import Phaser from 'phaser';
import { BOSS_REGISTRY } from '../bosses/BossRegistry';
import { ENEMY_REGISTRY } from '../enemies/EnemyRegistry';
import { POWERUP_REGISTRY } from '../powerups/PowerupRegistry';
import { SHIP_REGISTRY } from '../ships/ShipRegistry';
import { CGA_NUM } from '../style/CgaPalette';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create() {
    this.createShipAssets();
    this.createEnemyAssets();
    this.createBossAssets();
    this.createPowerupAssets();
    this.createStarTextures();

    this.scene.start('StartScene');
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

  private createBossAssets() {
    BOSS_REGISTRY.forEach((boss) => {
      boss.registerAssets(this);
    });
  }

  private createPowerupAssets() {
    POWERUP_REGISTRY.forEach((powerup) => {
      powerup.registerAssets(this);
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
