import Phaser from 'phaser';
import { BossDefinition } from '../BossDefinition';
import { CGA_NUM } from '../../style/CgaPalette';

type TinyCoreState = {
  centerX: number;
  hoverY: number;
};

// Lightweight training boss with low HP for quick iteration/testing.
export const bossModule: BossDefinition = {
  id: 'boss-tiny-core',
  name: 'TINY CORE',
  textureKey: 'boss-tiny-core',
  health: 20,
  collider: {
    width: 24,
    height: 12,
    offsetX: 2,
    offsetY: 4
  },
  movement: {
    onSpawn: ({ boss, spawnX }) => {
      boss.setVelocity(0, 28);
      return {
        centerX: spawnX,
        hoverY: 76
      } satisfies TinyCoreState;
    },
    onUpdate: ({ boss, ageSeconds, state, deltaSeconds, playfieldLeft, playfieldRight }) => {
      const core = state as TinyCoreState;

      if (boss.y < core.hoverY) {
        boss.y += 28 * deltaSeconds;
        return;
      }

      boss.y = core.hoverY + Math.sin(ageSeconds * 2.5) * 4;
      boss.x = core.centerX + Math.sin(ageSeconds * 1.6) * 30;
      boss.x = Phaser.Math.Clamp(boss.x, playfieldLeft + 16, playfieldRight - 16);
    }
  },
  registerAssets: (scene: Phaser.Scene) => {
    const g = scene.add.graphics();

    g.fillStyle(CGA_NUM.magenta, 1);
    g.fillRect(2, 4, 24, 12);
    g.fillStyle(CGA_NUM.cyan, 1);
    g.fillRect(6, 1, 16, 4);
    g.fillStyle(CGA_NUM.white, 1);
    g.fillRect(12, 0, 4, 2);
    g.generateTexture('boss-tiny-core', 28, 18);

    g.destroy();
  }
};
