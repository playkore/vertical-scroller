import Phaser from 'phaser';
import { EnemyDefinition } from '../EnemyDefinition';
import { getPlayerPosition, getTargetX, approach, moveEnemyVertically } from '../EnemyBehaviorUtils';
import { CGA_NUM } from '../../style/CgaPalette';

type OrbitState = {
  phase: 'approach' | 'orbit' | 'dive';
  phaseSeconds: number;
  anchorX: number;
  anchorY: number;
  radius: number;
  angle: number;
  angularSpeed: number;
  approachSpeed: number;
  diveSpeed: number;
};

export const enemyModule: EnemyDefinition = {
  id: 'orbit-diver',
  name: 'ORB',
  textureKey: 'enemy-orbit-diver',
  spawnWeight: 0.38,
  spawn: {
    minDelay: 1.25,
    maxDelay: 2.1,
    minSpeed: 62,
    maxSpeed: 84,
    xPadding: 22
  },
  collider: {
    width: 12,
    height: 12,
    offsetX: 2,
    offsetY: 2
  },
  movement: {
    onSpawn: ({ spawnX, scene, initialSpeed }) => {
      const player = getPlayerPosition(scene);
      return {
        phase: 'approach',
        phaseSeconds: 0,
        anchorX: player?.x ?? spawnX,
        anchorY: scene.scale.height * 0.36,
        radius: Phaser.Math.Between(26, 34),
        angle: Phaser.Math.FloatBetween(0, Math.PI * 2),
        angularSpeed: Phaser.Math.FloatBetween(2.4, 3.5),
        approachSpeed: initialSpeed,
        diveSpeed: Phaser.Math.Between(155, 210)
      } satisfies OrbitState;
    },
    onUpdate: ({ enemy, state, deltaSeconds, scene }) => {
      const orbit = state as OrbitState;
      orbit.phaseSeconds += deltaSeconds;

      if (orbit.phase === 'approach') {
        enemy.x = approach(enemy.x, orbit.anchorX, 70 * deltaSeconds);
        moveEnemyVertically(enemy, orbit.approachSpeed * deltaSeconds, scene.scale.height);
        if (enemy.y >= orbit.anchorY) {
          orbit.phase = 'orbit';
          orbit.phaseSeconds = 0;
        }
        return;
      }

      if (orbit.phase === 'orbit') {
        orbit.anchorX = approach(orbit.anchorX, getTargetX(scene, orbit.anchorX), 22 * deltaSeconds);
        orbit.angle += orbit.angularSpeed * deltaSeconds;
        enemy.x = orbit.anchorX + Math.cos(orbit.angle) * orbit.radius;
        enemy.y = orbit.anchorY + Math.sin(orbit.angle) * orbit.radius * 0.56;

        if (orbit.phaseSeconds >= 2.4) {
          orbit.phase = 'dive';
          orbit.phaseSeconds = 0;
        }
        return;
      }

      enemy.x = approach(enemy.x, getTargetX(scene, enemy.x), 110 * deltaSeconds);
      moveEnemyVertically(enemy, orbit.diveSpeed * deltaSeconds, scene.scale.height);
    }
  },
  registerAssets: (scene: Phaser.Scene) => {
    const g = scene.add.graphics();

    g.fillStyle(CGA_NUM.white, 1);
    g.fillRect(4, 2, 8, 8);
    g.fillStyle(CGA_NUM.cyan, 1);
    g.fillRect(2, 5, 2, 4);
    g.fillRect(12, 5, 2, 4);
    g.fillStyle(CGA_NUM.magenta, 1);
    g.fillRect(6, 0, 4, 2);
    g.fillRect(7, 10, 2, 4);
    g.generateTexture('enemy-orbit-diver', 16, 16);

    g.destroy();
  }
};
