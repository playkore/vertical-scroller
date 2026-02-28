import Phaser from 'phaser';
import { EnemyDefinition } from '../EnemyDefinition';
import { moveEnemyVertically } from '../EnemyBehaviorUtils';
import { CGA_NUM } from '../../style/CgaPalette';

type MineLayerState = {
  baseX: number;
  verticalSpeed: number;
  waveAmplitude: number;
  waveFrequency: number;
};

export const enemyModule: EnemyDefinition = {
  id: 'mine-layer',
  name: 'MNL',
  textureKey: 'enemy-mine-layer',
  spawnWeight: 0.36,
  spawn: {
    minDelay: 1.15,
    maxDelay: 1.95,
    minSpeed: 54,
    maxSpeed: 76,
    xPadding: 22
  },
  collider: {
    width: 14,
    height: 11,
    offsetX: 1,
    offsetY: 3
  },
  movement: {
    onSpawn: ({ spawnX, initialSpeed }) => {
      return {
        baseX: spawnX,
        verticalSpeed: initialSpeed,
        waveAmplitude: Phaser.Math.Between(20, 30),
        waveFrequency: Phaser.Math.FloatBetween(2.6, 3.5)
      } satisfies MineLayerState;
    },
    onUpdate: ({ enemy, state, ageSeconds, deltaSeconds, scene }) => {
      const layer = state as MineLayerState;
      layer.baseX += Math.sin(ageSeconds * 0.9) * 3.5 * deltaSeconds;
      enemy.x = layer.baseX + Math.sin(ageSeconds * layer.waveFrequency) * layer.waveAmplitude;
      moveEnemyVertically(enemy, layer.verticalSpeed * deltaSeconds, scene.scale.height);
    }
  },
  registerAssets: (scene: Phaser.Scene) => {
    const g = scene.add.graphics();

    g.fillStyle(CGA_NUM.white, 1);
    g.fillRect(2, 4, 12, 7);
    g.fillStyle(CGA_NUM.magenta, 1);
    g.fillRect(4, 2, 8, 2);
    g.fillStyle(CGA_NUM.cyan, 1);
    g.fillRect(3, 11, 2, 2);
    g.fillRect(7, 11, 2, 2);
    g.fillRect(11, 11, 2, 2);
    g.generateTexture('enemy-mine-layer', 16, 16);

    g.destroy();
  }
};
