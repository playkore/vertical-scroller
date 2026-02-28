import Phaser from 'phaser';
import { EnemyDefinition } from '../EnemyDefinition';
import { CGA_NUM } from '../../style/CgaPalette';

export const enemyModule: EnemyDefinition = {
  id: 'raider',
  name: 'RDR',
  textureKey: 'enemy-raider',
  maxHitPoints: 1,
  spawnWeight: 1.2,
  spawn: {
    minDelay: 0.45,
    maxDelay: 1,
    minSpeed: 95,
    maxSpeed: 150,
    xPadding: 16
  },
  collider: {
    width: 12,
    height: 12,
    offsetX: 2,
    offsetY: 2
  },
  movement: {
    onSpawn: ({ enemy, initialSpeed }) => {
      enemy.setVelocity(0, initialSpeed);
      return null;
    }
  },
  registerAssets: (scene: Phaser.Scene) => {
    const g = scene.add.graphics();

    g.fillStyle(CGA_NUM.magenta, 1);
    g.fillRect(2, 2, 12, 10);
    g.fillStyle(CGA_NUM.white, 1);
    g.fillRect(6, 0, 4, 2);
    g.fillRect(4, 12, 8, 2);
    g.generateTexture('enemy-raider', 16, 16);

    g.destroy();
  }
};
