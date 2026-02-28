import Phaser from 'phaser';
import { BulletBehaviorDefinition } from '../../bullets/BulletBehavior';
import { CGA_NUM } from '../../style/CgaPalette';
import { ShipDefinition } from '../ShipDefinition';

type FlameState = {
  spawnY: number;
  maxDistance: number;
  startScale: number;
  endScale: number;
};

const STRAIGHT_UP_ANGLE_DEG = -90;
const MAX_FLAME_ANGLE_OFFSET_DEG = Phaser.Math.RadToDeg(Math.atan2(36, 186));

const flameBehavior: BulletBehaviorDefinition = {
  id: 'flame-stream',
  onFire: ({ bullet, spawnY, params }) => {
    const velocityX = params.velocityX ?? 0;
    const velocityY = params.velocityY ?? -170;
    const angleJitterDeg = Math.max(0, params.angleJitterDeg ?? 0);
    const maxDistance = Math.max(36, params.maxDistance ?? 120)* Math.random() + 0.5;
    const startScale = params.startScale ?? bullet.scaleX;
    const endScale = Math.max(startScale, params.endScale ?? startScale + 1.1);
    const speed = Math.sqrt((velocityX * velocityX) + (velocityY * velocityY));
    const baseAngleDeg = Phaser.Math.RadToDeg(Math.atan2(velocityY, velocityX));
    const angleOffsetDeg = Phaser.Math.FloatBetween(-angleJitterDeg, angleJitterDeg);
    const nextAngleDeg = Phaser.Math.Clamp(
      baseAngleDeg + angleOffsetDeg,
      STRAIGHT_UP_ANGLE_DEG - MAX_FLAME_ANGLE_OFFSET_DEG,
      STRAIGHT_UP_ANGLE_DEG + MAX_FLAME_ANGLE_OFFSET_DEG
    );
    const nextAngleRad = Phaser.Math.DegToRad(nextAngleDeg);

    bullet.setVelocity(
      Math.cos(nextAngleRad) * speed,
      Math.sin(nextAngleRad) * speed
    );

    return {
      spawnY,
      maxDistance,
      startScale,
      endScale
    } satisfies FlameState;
  },
  onUpdate: ({ bullet, state }) => {
    const flame = state as FlameState;
    const traveled = Math.abs(flame.spawnY - bullet.y);

    if (traveled >= flame.maxDistance) {
      // Flames should pop out immediately once they exceed their range.
      bullet.disableBody(true, true);
      return;
    }

    const progress = Phaser.Math.Clamp(traveled / flame.maxDistance, 0, 1);
    const nextScale = Phaser.Math.Linear(flame.startScale, flame.endScale, progress);
    bullet.setScale(nextScale);
  }
};

export const shipModule: ShipDefinition = {
  id: 'flamethrower',
  name: 'FLAME',
  textureKey: 'ship-flamethrower',
  bulletBehaviors: [flameBehavior],
  weapon: {
    level: 1,
    fireInterval: 0.1,
    projectiles: [
      {
        offsetX: 0,
        offsetY: -7,
        textureKey: 'bullet-flame',
        scale: 0.5,
        behaviorId: 'flame-stream',
        behaviorParams: {
          velocityX: 0,
          velocityY: -170,
          angleJitterDeg: 6,
          startScale: 0.5,
          endScale: 1.4,
          maxDistance: 98
        },
        behaviorParamsPerLevel: {
          maxDistance: 18
        }
      },
      {
        offsetX: 0,
        offsetY: -12,
        textureKey: 'bullet-flame',
        scale: 0.58,
        behaviorId: 'flame-stream',
        behaviorParams: {
          velocityX: 0,
          velocityY: -176,
          angleJitterDeg: 4.5,
          startScale: 0.58,
          endScale: 1.48,
          maxDistance: 98
        },
        behaviorParamsPerLevel: {
          maxDistance: 18
        }
      },
      {
        offsetX: -2,
        offsetY: -13,
        textureKey: 'bullet-flame',
        scale: 0.62,
        behaviorId: 'flame-stream',
        behaviorParams: {
          velocityX: -24,
          velocityY: -178,
          angleJitterDeg: 3,
          startScale: 0.62,
          endScale: 1.52,
          maxDistance: 98
        },
        behaviorParamsPerLevel: {
          maxDistance: 18
        }
      },
      {
        offsetX: 2,
        offsetY: -13,
        textureKey: 'bullet-flame',
        scale: 0.62,
        behaviorId: 'flame-stream',
        behaviorParams: {
          velocityX: 24,
          velocityY: -178,
          angleJitterDeg: 3,
          startScale: 0.62,
          endScale: 1.52,
          maxDistance: 98
        },
        behaviorParamsPerLevel: {
          maxDistance: 18
        }
      },
      {
        offsetX: -4,
        offsetY: -19,
        textureKey: 'bullet-flame',
        scale: 0.76,
        behaviorId: 'flame-stream',
        behaviorParams: {
          velocityX: -36,
          velocityY: -186,
          angleJitterDeg: 2.5,
          startScale: 0.76,
          endScale: 1.68,
          maxDistance: 98
        },
        behaviorParamsPerLevel: {
          maxDistance: 18
        }
      },
      {
        offsetX: 4,
        offsetY: -19,
        textureKey: 'bullet-flame',
        scale: 0.76,
        behaviorId: 'flame-stream',
        behaviorParams: {
          velocityX: 36,
          velocityY: -186,
          angleJitterDeg: 2.5,
          startScale: 0.76,
          endScale: 1.68,
          maxDistance: 98
        },
        behaviorParamsPerLevel: {
          maxDistance: 18
        }
      }
    ]
  },
  registerAssets: (scene: Phaser.Scene) => {
    const g = scene.add.graphics();

    g.fillStyle(CGA_NUM.white, 1);
    g.fillTriangle(8, 0, 1, 15, 15, 15);
    g.fillStyle(CGA_NUM.magenta, 1);
    g.fillRect(6, 4, 4, 8);
    g.fillStyle(CGA_NUM.cyan, 1);
    g.fillRect(4, 10, 8, 3);
    g.generateTexture('ship-flamethrower', 16, 16);
    g.clear();

    g.fillStyle(CGA_NUM.magenta, 1);
    g.fillCircle(4, 4, 3);
    g.fillStyle(CGA_NUM.white, 1);
    g.fillCircle(4, 4, 1);
    g.generateTexture('bullet-flame', 8, 8);

    g.destroy();
  }
};
