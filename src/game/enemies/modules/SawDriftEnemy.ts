import Phaser from 'phaser';
import { EnemyDefinition } from '../EnemyDefinition';
import { moveEnemyVertically } from '../EnemyBehaviorUtils';
import { CGA_NUM } from '../../style/CgaPalette';

type DriftState = {
  horizontalSpeed: number;
  verticalSpeed: number;
};

export const enemyModule: EnemyDefinition = {
  id: 'saw-drift',
  name: 'SAW',
  textureKey: 'enemy-saw-drift',
  spawnWeight: 0.9,
  spawn: {
    minDelay: 0.8,
    maxDelay: 1.5,
    minSpeed: 70,
    maxSpeed: 95,
    xPadding: 20
  },
  collider: {
    width: 14,
    height: 10,
    offsetX: 1,
    offsetY: 3
  },
  movement: {
    onSpawn: ({ enemy, initialSpeed }) => {
      const horizontalSpeed = Phaser.Math.Between(90, 150) * (Math.random() > 0.5 ? 1 : -1);
      enemy.setVelocity(0, 0);
      return {
        horizontalSpeed,
        verticalSpeed: initialSpeed
      } satisfies DriftState;
    },
    onUpdate: ({ enemy, state, deltaSeconds, playfieldLeft, playfieldRight, scene }) => {
      const drift = state as DriftState;

      enemy.x += drift.horizontalSpeed * deltaSeconds;
      moveEnemyVertically(enemy, drift.verticalSpeed * deltaSeconds, scene.scale.height);

      if (enemy.x <= playfieldLeft + 8) {
        enemy.x = playfieldLeft + 8;
        drift.horizontalSpeed = Math.abs(drift.horizontalSpeed);
      }

      if (enemy.x >= playfieldRight - 8) {
        enemy.x = playfieldRight - 8;
        drift.horizontalSpeed = -Math.abs(drift.horizontalSpeed);
      }
    }
  },
  registerAssets: (scene: Phaser.Scene) => {
    const g = scene.add.graphics();

    g.fillStyle(CGA_NUM.white, 1);
    g.fillRect(1, 5, 14, 6);
    g.fillStyle(CGA_NUM.magenta, 1);
    g.fillRect(4, 2, 8, 2);
    g.fillStyle(CGA_NUM.cyan, 1);
    g.fillRect(0, 7, 16, 2);
    g.generateTexture('enemy-saw-drift', 16, 16);

    g.destroy();
  }
};
