import Phaser from 'phaser';
import { EnemyDefinition } from '../EnemyDefinition';
import { getTargetX, approach } from '../EnemyBehaviorUtils';
import { CGA_NUM } from '../../style/CgaPalette';

type PulseRamState = {
  baseSpeed: number;
  lateralSpeed: number;
  pulseSeconds: number;
};

export const enemyModule: EnemyDefinition = {
  id: 'pulse-ram',
  name: 'PLS',
  textureKey: 'enemy-pulse-ram',
  spawnWeight: 0.5,
  spawn: {
    minDelay: 0.9,
    maxDelay: 1.4,
    minSpeed: 72,
    maxSpeed: 96,
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
        baseSpeed: initialSpeed,
        lateralSpeed: Phaser.Math.Between(60, 88),
        pulseSeconds: Phaser.Math.FloatBetween(0, 1.5)
      } satisfies PulseRamState;
    },
    onUpdate: ({ enemy, state, deltaSeconds, scene }) => {
      const pulse = state as PulseRamState;
      pulse.pulseSeconds += deltaSeconds;

      const cycle = (pulse.pulseSeconds / 1.5) * Math.PI * 2;
      const pulseFactor = 0.65 + Math.max(0, Math.sin(cycle)) * 1.35;
      const currentSpeed = pulse.baseSpeed * pulseFactor;

      enemy.x = approach(enemy.x, getTargetX(scene, enemy.x), pulse.lateralSpeed * deltaSeconds);
      enemy.y += currentSpeed * deltaSeconds;
    }
  },
  registerAssets: (scene: Phaser.Scene) => {
    const g = scene.add.graphics();

    g.fillStyle(CGA_NUM.magenta, 1);
    g.fillRect(4, 2, 8, 10);
    g.fillStyle(CGA_NUM.white, 1);
    g.fillRect(6, 0, 4, 2);
    g.fillRect(6, 12, 4, 2);
    g.fillStyle(CGA_NUM.cyan, 1);
    g.fillRect(2, 7, 2, 3);
    g.fillRect(12, 7, 2, 3);
    g.generateTexture('enemy-pulse-ram', 16, 16);

    g.destroy();
  }
};
