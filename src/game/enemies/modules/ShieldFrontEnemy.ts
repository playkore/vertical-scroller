import Phaser from 'phaser';
import { EnemyDefinition } from '../EnemyDefinition';
import { getTargetX, approach } from '../EnemyBehaviorUtils';
import { CGA_NUM } from '../../style/CgaPalette';

type ShieldFrontState = {
  verticalSpeed: number;
  lateralSpeed: number;
};

export const enemyModule: EnemyDefinition = {
  id: 'shield-front',
  name: 'SHF',
  textureKey: 'enemy-shield-front',
  spawnWeight: 0.42,
  spawn: {
    minDelay: 1.1,
    maxDelay: 1.8,
    minSpeed: 66,
    maxSpeed: 92,
    xPadding: 18
  },
  collider: {
    width: 14,
    height: 12,
    offsetX: 1,
    offsetY: 2
  },
  movement: {
    onSpawn: ({ initialSpeed }) => {
      return {
        verticalSpeed: initialSpeed,
        lateralSpeed: Phaser.Math.Between(45, 72)
      } satisfies ShieldFrontState;
    },
    onUpdate: ({ enemy, state, deltaSeconds, scene }) => {
      const shield = state as ShieldFrontState;
      const targetX = getTargetX(scene, enemy.x);
      enemy.x = approach(enemy.x, targetX, shield.lateralSpeed * deltaSeconds);
      enemy.y += shield.verticalSpeed * deltaSeconds;
    }
  },
  registerAssets: (scene: Phaser.Scene) => {
    const g = scene.add.graphics();

    g.fillStyle(CGA_NUM.white, 1);
    g.fillRect(2, 2, 12, 5);
    g.fillStyle(CGA_NUM.magenta, 1);
    g.fillRect(4, 7, 8, 6);
    g.fillStyle(CGA_NUM.cyan, 1);
    g.fillRect(1, 8, 2, 3);
    g.fillRect(13, 8, 2, 3);
    g.generateTexture('enemy-shield-front', 16, 16);

    g.destroy();
  }
};
