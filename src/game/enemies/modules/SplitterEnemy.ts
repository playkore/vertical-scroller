import Phaser from 'phaser';
import { EnemyDefinition } from '../EnemyDefinition';
import { moveEnemyVertically } from '../EnemyBehaviorUtils';
import { CGA_NUM } from '../../style/CgaPalette';

type SplitterState = {
  horizontalSpeed: number;
  verticalSpeed: number;
  swapTimer: number;
  swapEvery: number;
};

export const enemyModule: EnemyDefinition = {
  id: 'splitter',
  name: 'SPL',
  textureKey: 'enemy-splitter',
  spawnWeight: 0.5,
  spawn: {
    minDelay: 0.95,
    maxDelay: 1.5,
    minSpeed: 76,
    maxSpeed: 102,
    xPadding: 18
  },
  collider: {
    width: 13,
    height: 12,
    offsetX: 1,
    offsetY: 2
  },
  movement: {
    onSpawn: ({ initialSpeed }) => {
      return {
        horizontalSpeed: Phaser.Math.Between(55, 95) * (Math.random() > 0.5 ? 1 : -1),
        verticalSpeed: initialSpeed,
        swapTimer: 0,
        swapEvery: Phaser.Math.FloatBetween(0.65, 1.05)
      } satisfies SplitterState;
    },
    onUpdate: ({ enemy, state, deltaSeconds, playfieldLeft, playfieldRight, scene }) => {
      const splitter = state as SplitterState;
      splitter.swapTimer += deltaSeconds;

      if (splitter.swapTimer >= splitter.swapEvery) {
        splitter.swapTimer = 0;
        splitter.swapEvery = Phaser.Math.FloatBetween(0.65, 1.05);
        splitter.horizontalSpeed *= -1;
      }

      enemy.x += splitter.horizontalSpeed * deltaSeconds;
      moveEnemyVertically(enemy, splitter.verticalSpeed * deltaSeconds, scene.scale.height);

      if (enemy.x <= playfieldLeft + 8) {
        enemy.x = playfieldLeft + 8;
        splitter.horizontalSpeed = Math.abs(splitter.horizontalSpeed);
      } else if (enemy.x >= playfieldRight - 8) {
        enemy.x = playfieldRight - 8;
        splitter.horizontalSpeed = -Math.abs(splitter.horizontalSpeed);
      }
    }
  },
  registerAssets: (scene: Phaser.Scene) => {
    const g = scene.add.graphics();

    g.fillStyle(CGA_NUM.magenta, 1);
    g.fillRect(2, 3, 12, 10);
    g.fillStyle(CGA_NUM.white, 1);
    g.fillRect(7, 3, 2, 10);
    g.fillStyle(CGA_NUM.cyan, 1);
    g.fillRect(1, 6, 1, 4);
    g.fillRect(14, 6, 1, 4);
    g.fillStyle(CGA_NUM.white, 1);
    g.fillRect(5, 1, 6, 2);
    g.generateTexture('enemy-splitter', 16, 16);

    g.destroy();
  }
};
