import Phaser from 'phaser';
import { BossDefinition } from '../BossDefinition';
import { CGA_NUM } from '../../style/CgaPalette';

type AlphaCoreState = {
  centerX: number;
  hoverY: number;
};

export const bossModule: BossDefinition = {
  id: 'boss-alpha-core',
  name: 'ALPHA CORE',
  textureKey: 'boss-alpha-core',
  health: 180,
  collider: {
    width: 44,
    height: 18,
    offsetX: 2,
    offsetY: 7
  },
  movement: {
    onSpawn: ({ boss, spawnX }) => {
      boss.setVelocity(0, 34);
      return {
        centerX: spawnX,
        hoverY: 90
      } satisfies AlphaCoreState;
    },
    onUpdate: ({ boss, ageSeconds, state, deltaSeconds, playfieldLeft, playfieldRight }) => {
      const core = state as AlphaCoreState;

      // Move in from top, then switch to horizontal hover sweep near the top.
      if (boss.y < core.hoverY) {
        boss.y += 34 * deltaSeconds;
        return;
      }

      boss.y = core.hoverY + Math.sin(ageSeconds * 2.2) * 6;
      boss.x = core.centerX + Math.sin(ageSeconds * 1.1) * 54;
      boss.x = Phaser.Math.Clamp(boss.x, playfieldLeft + 28, playfieldRight - 28);
    }
  },
  registerAssets: (scene: Phaser.Scene) => {
    const g = scene.add.graphics();

    g.fillStyle(CGA_NUM.magenta, 1);
    g.fillRect(2, 8, 44, 16);
    g.fillStyle(CGA_NUM.cyan, 1);
    g.fillRect(8, 4, 32, 6);
    g.fillStyle(CGA_NUM.white, 1);
    g.fillRect(20, 0, 8, 4);
    g.fillRect(6, 12, 4, 4);
    g.fillRect(38, 12, 4, 4);
    g.generateTexture('boss-alpha-core', 48, 28);

    g.destroy();
  }
};
