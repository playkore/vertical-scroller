import Phaser from 'phaser';
import { PowerupDefinition } from '../PowerupDefinition';
import { CGA_NUM } from '../../style/CgaPalette';

export const powerupModule: PowerupDefinition = {
  id: 'signal-scrap',
  name: 'SIGNAL SCRAP',
  textureKey: 'powerup-signal-scrap',
  fallSpeed: 92,
  behavior: {
    // Placeholder effect: this pickup is intentionally inert for now.
    onCollect: () => undefined
  },
  registerAssets: (scene: Phaser.Scene) => {
    if (scene.textures.exists('powerup-signal-scrap')) {
      return;
    }

    const g = scene.add.graphics();
    g.clear();
    g.fillStyle(CGA_NUM.cyan, 1);
    g.fillRect(4, 0, 8, 16);
    g.fillRect(0, 4, 16, 8);
    g.fillStyle(CGA_NUM.white, 1);
    g.fillRect(6, 2, 4, 12);
    g.fillRect(2, 6, 12, 4);
    g.generateTexture('powerup-signal-scrap', 16, 16);
    g.destroy();
  }
};
