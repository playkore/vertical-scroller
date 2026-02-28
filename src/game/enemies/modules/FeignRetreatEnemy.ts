import Phaser from 'phaser';
import { EnemyDefinition } from '../EnemyDefinition';
import { getTargetX, approach, moveEnemyVertically } from '../EnemyBehaviorUtils';
import { CGA_NUM } from '../../style/CgaPalette';

type FeignState = {
  phase: 'press' | 'retreat' | 'return';
  phaseSeconds: number;
  pressSpeed: number;
  retreatSpeed: number;
  returnSpeed: number;
  lateralSpeed: number;
};

export const enemyModule: EnemyDefinition = {
  id: 'feign-retreat',
  name: 'FGR',
  textureKey: 'enemy-feign-retreat',
  spawnWeight: 0.4,
  spawn: {
    minDelay: 1.15,
    maxDelay: 1.9,
    minSpeed: 74,
    maxSpeed: 95,
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
        phase: 'press',
        phaseSeconds: 0,
        pressSpeed: initialSpeed,
        retreatSpeed: Phaser.Math.Between(130, 170),
        returnSpeed: Phaser.Math.Between(145, 190),
        lateralSpeed: Phaser.Math.Between(90, 130)
      } satisfies FeignState;
    },
    onUpdate: ({ enemy, state, deltaSeconds, scene }) => {
      const feign = state as FeignState;
      feign.phaseSeconds += deltaSeconds;

      if (feign.phase === 'press' && feign.phaseSeconds >= 1.9) {
        feign.phase = 'retreat';
        feign.phaseSeconds = 0;
      } else if (feign.phase === 'retreat' && feign.phaseSeconds >= 0.9) {
        feign.phase = 'return';
        feign.phaseSeconds = 0;
      } else if (feign.phase === 'return' && feign.phaseSeconds >= 1.3) {
        feign.phase = 'press';
        feign.phaseSeconds = 0;
      }

      enemy.x = approach(enemy.x, getTargetX(scene, enemy.x), feign.lateralSpeed * deltaSeconds);

      if (feign.phase === 'press') {
        moveEnemyVertically(enemy, feign.pressSpeed * deltaSeconds, scene.scale.height);
        return;
      }

      if (feign.phase === 'retreat') {
        moveEnemyVertically(enemy, -feign.retreatSpeed * deltaSeconds, scene.scale.height);
        return;
      }

      moveEnemyVertically(enemy, feign.returnSpeed * deltaSeconds, scene.scale.height);
    }
  },
  registerAssets: (scene: Phaser.Scene) => {
    const g = scene.add.graphics();

    g.fillStyle(CGA_NUM.magenta, 1);
    g.fillRect(4, 2, 8, 10);
    g.fillStyle(CGA_NUM.white, 1);
    g.fillRect(6, 0, 4, 2);
    g.fillStyle(CGA_NUM.cyan, 1);
    g.fillRect(2, 6, 2, 4);
    g.fillRect(12, 6, 2, 4);
    g.fillStyle(CGA_NUM.white, 1);
    g.fillRect(6, 12, 4, 2);
    g.generateTexture('enemy-feign-retreat', 16, 16);

    g.destroy();
  }
};
