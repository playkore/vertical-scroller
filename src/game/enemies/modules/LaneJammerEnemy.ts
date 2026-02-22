import Phaser from 'phaser';
import { EnemyDefinition } from '../EnemyDefinition';
import { getTargetX } from '../EnemyBehaviorUtils';
import { CGA_NUM } from '../../style/CgaPalette';

type LaneJammerState = {
  laneCenterX: number;
  laneWidth: number;
  verticalSpeed: number;
  hopTimer: number;
  hopEvery: number;
};

export const enemyModule: EnemyDefinition = {
  id: 'lane-jammer',
  name: 'LJM',
  textureKey: 'enemy-lane-jammer',
  spawnWeight: 0.44,
  spawn: {
    minDelay: 1,
    maxDelay: 1.7,
    minSpeed: 70,
    maxSpeed: 96,
    xPadding: 20
  },
  collider: {
    width: 12,
    height: 12,
    offsetX: 2,
    offsetY: 2
  },
  movement: {
    onSpawn: ({ spawnX, playfieldLeft, playfieldRight, initialSpeed }) => {
      const laneWidth = (playfieldRight - playfieldLeft) / 4;
      const laneIndex = Phaser.Math.Clamp(Math.floor((spawnX - playfieldLeft) / laneWidth), 0, 3);
      return {
        laneCenterX: playfieldLeft + laneWidth * laneIndex + laneWidth * 0.5,
        laneWidth,
        verticalSpeed: initialSpeed,
        hopTimer: 0,
        hopEvery: Phaser.Math.FloatBetween(0.95, 1.5)
      } satisfies LaneJammerState;
    },
    onUpdate: ({ enemy, state, deltaSeconds, scene, playfieldLeft, playfieldRight }) => {
      const jammer = state as LaneJammerState;
      jammer.hopTimer += deltaSeconds;

      const targetX = getTargetX(scene, jammer.laneCenterX);
      const alignedToPlayer = Math.abs(enemy.x - targetX) < jammer.laneWidth * 0.45;

      if (alignedToPlayer && jammer.hopTimer >= jammer.hopEvery) {
        jammer.hopTimer = 0;
        jammer.hopEvery = Phaser.Math.FloatBetween(0.95, 1.5);
        const hopDir = Math.random() > 0.5 ? 1 : -1;
        const nextLane = jammer.laneCenterX + jammer.laneWidth * hopDir;
        jammer.laneCenterX = Phaser.Math.Clamp(
          nextLane,
          playfieldLeft + jammer.laneWidth * 0.5,
          playfieldRight - jammer.laneWidth * 0.5
        );
      }

      enemy.x = Phaser.Math.Linear(enemy.x, jammer.laneCenterX, Math.min(1, deltaSeconds * 13));
      enemy.y += jammer.verticalSpeed * deltaSeconds;
    }
  },
  registerAssets: (scene: Phaser.Scene) => {
    const g = scene.add.graphics();

    g.fillStyle(CGA_NUM.white, 1);
    g.fillRect(4, 3, 8, 9);
    g.fillStyle(CGA_NUM.magenta, 1);
    g.fillRect(2, 5, 2, 5);
    g.fillRect(12, 5, 2, 5);
    g.fillStyle(CGA_NUM.cyan, 1);
    g.fillRect(6, 1, 4, 2);
    g.fillRect(6, 12, 4, 2);
    g.generateTexture('enemy-lane-jammer', 16, 16);

    g.destroy();
  }
};
