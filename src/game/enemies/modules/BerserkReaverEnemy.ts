import Phaser from 'phaser';
import { EnemyDefinition } from '../EnemyDefinition';
import { getTargetX, approach, moveEnemyVertically } from '../EnemyBehaviorUtils';
import { CGA_NUM } from '../../style/CgaPalette';

type ReaverState = {
  phase: 'chase' | 'retreat';
  phaseSeconds: number;
  verticalSpeed: number;
  lateralSpeed: number;
  retreatSpeed: number;
};

export const enemyModule: EnemyDefinition = {
  id: 'berserk-reaver',
  name: 'BRV',
  textureKey: 'enemy-berserk-reaver',
  spawnWeight: 0.45,
  spawn: {
    minDelay: 1.2,
    maxDelay: 2,
    minSpeed: 72,
    maxSpeed: 95,
    xPadding: 20
  },
  collider: {
    width: 13,
    height: 13,
    offsetX: 1,
    offsetY: 1
  },
  movement: {
    onSpawn: ({ initialSpeed }) => {
      return {
        phase: 'chase',
        phaseSeconds: 0,
        verticalSpeed: initialSpeed,
        lateralSpeed: Phaser.Math.Between(90, 125),
        retreatSpeed: Phaser.Math.Between(120, 165)
      } satisfies ReaverState;
    },
    onUpdate: ({ enemy, state, deltaSeconds, scene }) => {
      const reaver = state as ReaverState;
      reaver.phaseSeconds += deltaSeconds;

      // Enemy API has no on-hit hook yet, so we approximate fear/recover
      // with deterministic chase/retreat timing windows.
      if (reaver.phase === 'chase' && reaver.phaseSeconds >= 2.8) {
        reaver.phase = 'retreat';
        reaver.phaseSeconds = 0;
      } else if (reaver.phase === 'retreat' && reaver.phaseSeconds >= 1.2) {
        reaver.phase = 'chase';
        reaver.phaseSeconds = 0;
      }

      const targetX = getTargetX(scene, enemy.x);
      const xSpeed = reaver.phase === 'chase' ? reaver.lateralSpeed : reaver.lateralSpeed * 0.65;
      enemy.x = approach(enemy.x, targetX, xSpeed * deltaSeconds);

      if (reaver.phase === 'chase') {
        moveEnemyVertically(enemy, reaver.verticalSpeed * deltaSeconds, scene.scale.height);
      } else {
        moveEnemyVertically(enemy, -reaver.retreatSpeed * deltaSeconds, scene.scale.height);
      }
    }
  },
  registerAssets: (scene: Phaser.Scene) => {
    const g = scene.add.graphics();

    g.fillStyle(CGA_NUM.magenta, 1);
    g.fillRect(3, 2, 10, 10);
    g.fillStyle(CGA_NUM.white, 1);
    g.fillRect(5, 0, 6, 2);
    g.fillRect(5, 12, 6, 2);
    g.fillStyle(CGA_NUM.cyan, 1);
    g.fillRect(1, 5, 2, 6);
    g.fillRect(13, 5, 2, 6);
    g.fillStyle(CGA_NUM.white, 1);
    g.fillRect(6, 5, 4, 4);
    g.generateTexture('enemy-berserk-reaver', 16, 16);

    g.destroy();
  }
};
