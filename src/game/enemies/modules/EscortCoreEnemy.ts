import Phaser from 'phaser';
import { EnemyDefinition } from '../EnemyDefinition';
import { CGA_NUM } from '../../style/CgaPalette';

type EscortState = {
  baseX: number;
  verticalSpeed: number;
  swayAmplitude: number;
  swayFrequency: number;
};

export const enemyModule: EnemyDefinition = {
  id: 'escort-core',
  name: 'ESC',
  textureKey: 'enemy-escort-core',
  spawnWeight: 0.3,
  spawn: {
    minDelay: 1.35,
    maxDelay: 2.15,
    minSpeed: 58,
    maxSpeed: 80,
    xPadding: 24
  },
  collider: {
    width: 14,
    height: 12,
    offsetX: 1,
    offsetY: 2
  },
  movement: {
    onSpawn: ({ spawnX, initialSpeed }) => {
      return {
        baseX: spawnX,
        verticalSpeed: initialSpeed,
        swayAmplitude: Phaser.Math.Between(12, 20),
        swayFrequency: Phaser.Math.FloatBetween(1.8, 2.6)
      } satisfies EscortState;
    },
    onUpdate: ({ enemy, state, ageSeconds, deltaSeconds }) => {
      const escort = state as EscortState;
      enemy.x = escort.baseX + Math.sin(ageSeconds * escort.swayFrequency) * escort.swayAmplitude;
      enemy.y += escort.verticalSpeed * deltaSeconds;
    }
  },
  registerAssets: (scene: Phaser.Scene) => {
    const g = scene.add.graphics();

    g.fillStyle(CGA_NUM.white, 1);
    g.fillRect(5, 4, 6, 8);
    g.fillStyle(CGA_NUM.magenta, 1);
    g.fillRect(1, 5, 3, 6);
    g.fillRect(12, 5, 3, 6);
    g.fillStyle(CGA_NUM.cyan, 1);
    g.fillRect(6, 2, 4, 2);
    g.fillRect(6, 12, 4, 2);
    g.generateTexture('enemy-escort-core', 16, 16);

    g.destroy();
  }
};
