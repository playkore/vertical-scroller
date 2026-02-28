import Phaser from 'phaser';
import { EnemyDefinition } from '../EnemyDefinition';
import { moveEnemyVertically } from '../EnemyBehaviorUtils';
import { CGA_NUM } from '../../style/CgaPalette';

type WaveState = {
  baseX: number;
  amplitude: number;
  frequency: number;
  verticalSpeed: number;
};

export const enemyModule: EnemyDefinition = {
  id: 'wave-eel',
  name: 'WVE',
  textureKey: 'enemy-wave-eel',
  spawnWeight: 1,
  spawn: {
    minDelay: 0.6,
    maxDelay: 1.3,
    minSpeed: 75,
    maxSpeed: 110,
    xPadding: 20
  },
  collider: {
    width: 11,
    height: 13,
    offsetX: 2,
    offsetY: 1
  },
  movement: {
    onSpawn: ({ enemy, spawnX, initialSpeed }) => {
      enemy.setVelocity(0, 0);
      return {
        baseX: spawnX,
        amplitude: Phaser.Math.Between(18, 34),
        frequency: Phaser.Math.FloatBetween(3.6, 5.2),
        verticalSpeed: initialSpeed
      } satisfies WaveState;
    },
    onUpdate: ({ enemy, ageSeconds, state, deltaSeconds, scene }) => {
      const wave = state as WaveState;
      wave.baseX += Math.sin(ageSeconds * 0.8) * 6 * deltaSeconds;
      enemy.x = wave.baseX + Math.sin(ageSeconds * wave.frequency) * wave.amplitude;
      moveEnemyVertically(enemy, wave.verticalSpeed * deltaSeconds, scene.scale.height);
    }
  },
  registerAssets: (scene: Phaser.Scene) => {
    const g = scene.add.graphics();

    g.fillStyle(CGA_NUM.cyan, 1);
    g.fillRect(3, 1, 10, 14);
    g.fillStyle(CGA_NUM.white, 1);
    g.fillRect(1, 4, 2, 8);
    g.fillRect(13, 4, 2, 8);
    g.fillStyle(CGA_NUM.magenta, 1);
    g.fillRect(6, 0, 4, 2);
    g.generateTexture('enemy-wave-eel', 16, 16);

    g.destroy();
  }
};
