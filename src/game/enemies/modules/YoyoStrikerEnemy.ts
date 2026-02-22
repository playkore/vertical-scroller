import Phaser from 'phaser';
import { EnemyDefinition } from '../EnemyDefinition';
import { CGA_NUM } from '../../style/CgaPalette';

type YoyoState = {
  verticalSpeed: number;
  direction: 1 | -1;
  minY: number;
  maxY: number;
};

export const enemyModule: EnemyDefinition = {
  id: 'yoyo-striker',
  name: 'YYO',
  textureKey: 'enemy-yoyo-striker',
  spawnWeight: 0.45,
  spawn: {
    minDelay: 1.05,
    maxDelay: 1.8,
    minSpeed: 70,
    maxSpeed: 96,
    xPadding: 20
  },
  collider: {
    width: 12,
    height: 14,
    offsetX: 2,
    offsetY: 1
  },
  movement: {
    onSpawn: ({ scene, initialSpeed }) => {
      return {
        verticalSpeed: initialSpeed,
        direction: 1,
        minY: -18,
        maxY: scene.scale.height * 0.82
      } satisfies YoyoState;
    },
    onUpdate: ({ enemy, state, deltaSeconds }) => {
      const yoyo = state as YoyoState;
      enemy.y += yoyo.verticalSpeed * yoyo.direction * deltaSeconds;

      if (enemy.y >= yoyo.maxY) {
        enemy.y = yoyo.maxY;
        yoyo.direction = -1;
      } else if (enemy.y <= yoyo.minY) {
        enemy.y = yoyo.minY;
        yoyo.direction = 1;
      }
    }
  },
  registerAssets: (scene: Phaser.Scene) => {
    const g = scene.add.graphics();

    g.fillStyle(CGA_NUM.white, 1);
    g.fillRect(6, 0, 4, 2);
    g.fillRect(6, 14, 4, 2);
    g.fillStyle(CGA_NUM.magenta, 1);
    g.fillRect(4, 2, 8, 12);
    g.fillStyle(CGA_NUM.cyan, 1);
    g.fillRect(2, 6, 2, 4);
    g.fillRect(12, 6, 2, 4);
    g.generateTexture('enemy-yoyo-striker', 16, 16);

    g.destroy();
  }
};
