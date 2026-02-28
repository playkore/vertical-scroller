import Phaser from 'phaser';
import { EnemyDefinition } from '../EnemyDefinition';
import { getTargetX, approach, moveEnemyVertically } from '../EnemyBehaviorUtils';
import { CGA_NUM } from '../../style/CgaPalette';

type HunterState = {
  verticalSpeed: number;
  lateralSpeed: number;
};

export const enemyModule: EnemyDefinition = {
  id: 'hunter',
  name: 'HNT',
  textureKey: 'enemy-hunter',
  spawnWeight: 0.8,
  spawn: {
    minDelay: 0.8,
    maxDelay: 1.5,
    minSpeed: 78,
    maxSpeed: 105,
    xPadding: 18
  },
  collider: {
    width: 12,
    height: 12,
    offsetX: 2,
    offsetY: 2
  },
  movement: {
    onSpawn: ({ initialSpeed }) => {
      return {
        verticalSpeed: initialSpeed,
        lateralSpeed: Phaser.Math.Between(110, 150)
      } satisfies HunterState;
    },
    onUpdate: ({ enemy, state, deltaSeconds, scene }) => {
      const hunter = state as HunterState;
      const targetX = getTargetX(scene, enemy.x);

      enemy.x = approach(enemy.x, targetX, hunter.lateralSpeed * deltaSeconds);
      moveEnemyVertically(enemy, hunter.verticalSpeed * deltaSeconds, scene.scale.height);
    }
  },
  registerAssets: (scene: Phaser.Scene) => {
    const g = scene.add.graphics();

    g.fillStyle(CGA_NUM.white, 1);
    g.fillRect(7, 0, 2, 2);
    g.fillStyle(CGA_NUM.magenta, 1);
    g.fillRect(5, 2, 6, 8);
    g.fillStyle(CGA_NUM.cyan, 1);
    g.fillRect(3, 6, 2, 5);
    g.fillRect(11, 6, 2, 5);
    g.fillStyle(CGA_NUM.white, 1);
    g.fillRect(6, 10, 4, 4);
    g.generateTexture('enemy-hunter', 16, 16);

    g.destroy();
  }
};
