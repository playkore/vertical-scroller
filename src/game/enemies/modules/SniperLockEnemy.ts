import Phaser from 'phaser';
import { EnemyDefinition } from '../EnemyDefinition';
import { getPlayerPosition, moveEnemyVertically } from '../EnemyBehaviorUtils';
import { CGA_NUM } from '../../style/CgaPalette';

type SniperState = {
  phase: 'lock' | 'dash' | 'cooldown';
  phaseSeconds: number;
  driftSpeed: number;
  lockSeconds: number;
  dashSeconds: number;
  dashVector: Phaser.Math.Vector2;
  dashSpeed: number;
};

export const enemyModule: EnemyDefinition = {
  id: 'sniper-lock',
  name: 'SNL',
  textureKey: 'enemy-sniper-lock',
  spawnWeight: 0.42,
  spawn: {
    minDelay: 1.2,
    maxDelay: 2,
    minSpeed: 58,
    maxSpeed: 78,
    xPadding: 18
  },
  collider: {
    width: 10,
    height: 13,
    offsetX: 3,
    offsetY: 1
  },
  movement: {
    onSpawn: ({ enemy, scene, spawnX, spawnY, initialSpeed }) => {
      const playerPos = getPlayerPosition(scene);
      const aimX = playerPos?.x ?? spawnX;
      const aimY = playerPos?.y ?? scene.scale.height * 0.8;
      const dashVector = new Phaser.Math.Vector2(aimX - spawnX, aimY - spawnY).normalize();

      // Keep the burst mostly downward so it remains a readable attack.
      if (dashVector.y < 0.3) {
        dashVector.y = 0.3;
        dashVector.normalize();
      }

      enemy.setVelocity(0, 0);
      return {
        phase: 'lock',
        phaseSeconds: 0,
        driftSpeed: initialSpeed,
        lockSeconds: Phaser.Math.FloatBetween(0.9, 1.15),
        dashSeconds: Phaser.Math.FloatBetween(0.34, 0.5),
        dashVector,
        dashSpeed: Phaser.Math.Between(220, 270)
      } satisfies SniperState;
    },
    onUpdate: ({ enemy, state, deltaSeconds, scene }) => {
      const sniper = state as SniperState;
      sniper.phaseSeconds += deltaSeconds;

      if (sniper.phase === 'lock') {
        moveEnemyVertically(enemy, sniper.driftSpeed * 0.4 * deltaSeconds, scene.scale.height);
        if (sniper.phaseSeconds >= sniper.lockSeconds) {
          sniper.phase = 'dash';
          sniper.phaseSeconds = 0;
        }
        return;
      }

      if (sniper.phase === 'dash') {
        enemy.x += sniper.dashVector.x * sniper.dashSpeed * deltaSeconds;
        moveEnemyVertically(enemy, sniper.dashVector.y * sniper.dashSpeed * deltaSeconds, scene.scale.height);
        if (sniper.phaseSeconds >= sniper.dashSeconds) {
          sniper.phase = 'cooldown';
          sniper.phaseSeconds = 0;
        }
        return;
      }

      moveEnemyVertically(enemy, sniper.driftSpeed * deltaSeconds, scene.scale.height);
    }
  },
  registerAssets: (scene: Phaser.Scene) => {
    const g = scene.add.graphics();

    g.fillStyle(CGA_NUM.cyan, 1);
    g.fillRect(7, 0, 2, 4);
    g.fillStyle(CGA_NUM.white, 1);
    g.fillRect(5, 2, 6, 10);
    g.fillStyle(CGA_NUM.magenta, 1);
    g.fillRect(3, 4, 2, 8);
    g.fillRect(11, 4, 2, 8);
    g.fillStyle(CGA_NUM.white, 1);
    g.fillRect(6, 12, 4, 2);
    g.generateTexture('enemy-sniper-lock', 16, 16);

    g.destroy();
  }
};
