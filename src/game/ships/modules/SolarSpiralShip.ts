import Phaser from 'phaser';
import { BulletBehaviorDefinition } from '../../bullets/BulletBehavior';
import { ShipDefinition } from '../ShipDefinition';

const COLORS = {
  cyan: 0x55ffff,
  white: 0xffffff,
  magenta: 0xff55ff
};

type SpiralState = {
  centerX: number;
  centerY: number;
  centerVelocityX: number;
  centerVelocityY: number;
  angularSpeed: number;
  phase: number;
  radius: number;
  radiusGrowth: number;
};

const solarSpiralBehavior: BulletBehaviorDefinition = {
  id: 'solar-expanding-spiral',
  onFire: ({ bullet, spawnX, spawnY, params }) => {
    const centerVelocityX = params.centerVelocityX ?? 0;
    const centerVelocityY = params.centerVelocityY ?? -230;
    const angularSpeed = params.angularSpeed ?? 11;
    const phase = params.phase ?? 0;
    const radius = params.initialRadius ?? 2;
    const radiusGrowth = params.radiusGrowth ?? 24;

    bullet.setVelocity(0, 0);
    bullet.setPosition(spawnX + Math.cos(phase) * radius, spawnY + Math.sin(phase) * radius);

    return {
      centerX: spawnX,
      centerY: spawnY,
      centerVelocityX,
      centerVelocityY,
      angularSpeed,
      phase,
      radius,
      radiusGrowth
    } satisfies SpiralState;
  },
  onUpdate: ({ bullet, deltaSeconds, state }) => {
    const spiral = state as SpiralState;

    spiral.centerX += spiral.centerVelocityX * deltaSeconds;
    spiral.centerY += spiral.centerVelocityY * deltaSeconds;
    spiral.phase += spiral.angularSpeed * deltaSeconds;
    spiral.radius += spiral.radiusGrowth * deltaSeconds;

    bullet.setPosition(
      spiral.centerX + Math.cos(spiral.phase) * spiral.radius,
      spiral.centerY + Math.sin(spiral.phase) * spiral.radius
    );
  }
};

export const shipModule: ShipDefinition = {
  id: 'solar-spiral',
  name: 'SUN',
  textureKey: 'ship-solar-spiral',
  bulletBehaviors: [solarSpiralBehavior],
  weapon: {
    fireInterval: 0.24,
    projectiles: [
      {
        offsetX: 0,
        offsetY: -11,
        textureKey: 'bullet-solar-spiral',
        scale: 0.95,
        behaviorId: 'solar-expanding-spiral',
        behaviorParams: {
          centerVelocityX: 0,
          centerVelocityY: -230,
          angularSpeed: 11,
          initialRadius: 2,
          radiusGrowth: 24,
          phase: 0
        }
      },
      {
        offsetX: 0,
        offsetY: -11,
        textureKey: 'bullet-solar-spiral',
        scale: 0.95,
        behaviorId: 'solar-expanding-spiral',
        behaviorParams: {
          centerVelocityX: 0,
          centerVelocityY: -230,
          angularSpeed: -11,
          initialRadius: 2,
          radiusGrowth: 24,
          phase: 3.14159
        }
      }
    ]
  },
  registerAssets: (scene: Phaser.Scene) => {
    const g = scene.add.graphics();

    g.fillStyle(COLORS.cyan, 1);
    g.fillTriangle(8, 0, 1, 15, 15, 15);
    g.fillStyle(COLORS.white, 1);
    g.fillRect(7, 5, 2, 6);
    g.fillStyle(COLORS.magenta, 1);
    g.fillRect(5, 12, 6, 2);
    g.generateTexture('ship-solar-spiral', 16, 16);
    g.clear();

    g.fillStyle(COLORS.cyan, 1);
    g.fillRect(1, 1, 4, 4);
    g.fillStyle(COLORS.white, 1);
    g.fillRect(2, 2, 2, 2);
    g.generateTexture('bullet-solar-spiral', 6, 6);

    g.destroy();
  }
};
