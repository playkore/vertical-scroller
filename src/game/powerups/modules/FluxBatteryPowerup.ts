import Phaser from 'phaser';
import { PowerupDefinition } from '../PowerupDefinition';
import { CGA_NUM } from '../../style/CgaPalette';

export const powerupModule: PowerupDefinition = {
  id: 'flux-battery',
  name: 'FLUX BATTERY',
  textureKey: 'powerup-flux-battery',
  fallSpeed: 102,
  behavior: {
    // Placeholder effect: this pickup is intentionally inert for now.
    onCollect: () => undefined
  },
  registerAssets: (scene: Phaser.Scene) => {
    if (scene.textures.exists('powerup-flux-battery')) {
      return;
    }

    const g = scene.add.graphics();
    g.clear();
    g.fillStyle(CGA_NUM.magenta, 1);
    g.fillRect(0, 0, 16, 16);
    g.fillStyle(CGA_NUM.black, 1);
    g.fillRect(3, 3, 10, 10);
    g.fillStyle(CGA_NUM.white, 1);
    g.fillRect(5, 1, 6, 2);
    g.fillRect(6, 5, 4, 6);
    g.generateTexture('powerup-flux-battery', 16, 16);
    g.destroy();
  }
};
