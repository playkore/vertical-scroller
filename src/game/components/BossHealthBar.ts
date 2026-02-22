import Phaser from 'phaser';
import { getPlayfieldBounds } from '../layout/Playfield';
import { CGA_NUM } from '../style/CgaPalette';

export class BossHealthBar {
  private readonly barGraphics: Phaser.GameObjects.Graphics;

  constructor(private readonly scene: Phaser.Scene) {
    this.barGraphics = this.scene.add.graphics().setDepth(90).setScrollFactor(0);
  }

  update(healthRatio: number | null) {
    this.barGraphics.clear();

    if (healthRatio === null) {
      return;
    }

    const { width, height } = this.scene.scale;
    const bounds = getPlayfieldBounds(width, height);

    // Mirror the level progress bar on the right side for boss health.
    const barWidth = 3;
    const barX = width - Math.max(2 + barWidth, Math.floor(bounds.sidePanelWidth * 0.45));
    const margin = Math.round(height * 0.1);
    const trackHeight = Math.max(0, height - margin * 2);
    const clampedHealth = Phaser.Math.Clamp(healthRatio, 0, 1);
    const filledHeight = Math.round(trackHeight * clampedHealth);

    this.barGraphics.fillStyle(CGA_NUM.white, 1);
    this.barGraphics.fillRect(barX, margin, barWidth, trackHeight);
    this.barGraphics.fillStyle(CGA_NUM.cyan, 1);
    this.barGraphics.fillRect(barX, margin + trackHeight - filledHeight, barWidth, filledHeight);
  }

  destroy() {
    this.barGraphics.destroy();
  }
}
