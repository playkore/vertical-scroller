import Phaser from 'phaser';
import { EnemyDefinition } from '../EnemyDefinition';
import { getTargetX, approach } from '../EnemyBehaviorUtils';
import { CGA_NUM } from '../../style/CgaPalette';

type UndercutState = {
  phase: 'drop' | 'rise';
  verticalSpeed: number;
  riseSpeed: number;
  lateralSpeed: number;
  turnY: number;
};

export const enemyModule: EnemyDefinition = {
  id: 'undercut-hunter',
  name: 'UND',
  textureKey: 'enemy-undercut-hunter',
  spawnWeight: 0.33,
  spawn: {
    minDelay: 1.3,
    maxDelay: 2.1,
    minSpeed: 85,
    maxSpeed: 112,
    xPadding: 18
  },
  collider: {
    width: 12,
    height: 13,
    offsetX: 2,
    offsetY: 1
  },
  movement: {
    onSpawn: ({ scene, initialSpeed }) => {
      return {
        phase: 'drop',
        verticalSpeed: initialSpeed,
        riseSpeed: Phaser.Math.Between(135, 175),
        lateralSpeed: Phaser.Math.Between(95, 130),
        turnY: scene.scale.height * 0.86
      } satisfies UndercutState;
    },
    onUpdate: ({ enemy, state, deltaSeconds, scene }) => {
      const undercut = state as UndercutState;

      if (undercut.phase === 'drop') {
        enemy.y += undercut.verticalSpeed * deltaSeconds;
        if (enemy.y >= undercut.turnY) {
          undercut.phase = 'rise';
        }
        return;
      }

      enemy.x = approach(enemy.x, getTargetX(scene, enemy.x), undercut.lateralSpeed * deltaSeconds);
      enemy.y -= undercut.riseSpeed * deltaSeconds;
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
    g.fillRect(2, 4, 2, 4);
    g.fillRect(12, 8, 2, 4);
    g.generateTexture('enemy-undercut-hunter', 16, 16);

    g.destroy();
  }
};
