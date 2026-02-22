import Phaser from 'phaser';
import { EnemyDefinition } from '../EnemyDefinition';
import { CGA_NUM } from '../../style/CgaPalette';

type GravityWellState = {
  baseX: number;
  verticalSpeed: number;
  driftAmplitude: number;
  driftFrequency: number;
};

export const enemyModule: EnemyDefinition = {
  id: 'gravity-well',
  name: 'GRW',
  textureKey: 'enemy-gravity-well',
  spawnWeight: 0.28,
  spawn: {
    minDelay: 1.45,
    maxDelay: 2.3,
    minSpeed: 42,
    maxSpeed: 62,
    xPadding: 24
  },
  collider: {
    width: 13,
    height: 13,
    offsetX: 1,
    offsetY: 1
  },
  movement: {
    onSpawn: ({ spawnX, initialSpeed }) => {
      return {
        baseX: spawnX,
        verticalSpeed: initialSpeed,
        driftAmplitude: Phaser.Math.Between(8, 14),
        driftFrequency: Phaser.Math.FloatBetween(1.4, 2)
      } satisfies GravityWellState;
    },
    onUpdate: ({ enemy, state, ageSeconds, deltaSeconds }) => {
      const well = state as GravityWellState;
      enemy.x = well.baseX + Math.sin(ageSeconds * well.driftFrequency) * well.driftAmplitude;
      enemy.y += well.verticalSpeed * deltaSeconds;
    }
  },
  registerAssets: (scene: Phaser.Scene) => {
    const g = scene.add.graphics();

    g.fillStyle(CGA_NUM.cyan, 1);
    g.fillRect(3, 3, 10, 10);
    g.fillStyle(CGA_NUM.white, 1);
    g.fillRect(1, 5, 2, 6);
    g.fillRect(13, 5, 2, 6);
    g.fillRect(5, 1, 6, 2);
    g.fillRect(5, 13, 6, 2);
    g.fillStyle(CGA_NUM.magenta, 1);
    g.fillRect(6, 6, 4, 4);
    g.generateTexture('enemy-gravity-well', 16, 16);

    g.destroy();
  }
};
