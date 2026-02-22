import Phaser from 'phaser';
import { getPlayfieldBounds } from '../layout/Playfield';
import { CGA_NUM } from '../style/CgaPalette';

export class LevelProgressBar {
  private readonly barGraphics: Phaser.GameObjects.Graphics;

  constructor(private readonly scene: Phaser.Scene) {
    this.barGraphics = this.scene.add.graphics().setDepth(90).setScrollFactor(0);
  }

  update(progressRatio: number) {
    const { width, height } = this.scene.scale;
    const bounds = getPlayfieldBounds(width, height);

    // Reserve vertical margins and fill the bar from bottom to top based on level progress.
    const barX = Math.max(2, Math.floor(bounds.left * 0.45));
    const barWidth = 3;
    const margin = Math.round(height * 0.1);
    const trackHeight = Math.max(0, height - margin * 2);
    const clampedProgress = Phaser.Math.Clamp(progressRatio, 0, 1);
    const filledHeight = Math.round(trackHeight * clampedProgress);

    this.barGraphics.clear();
    this.barGraphics.fillStyle(CGA_NUM.white, 1);
    this.barGraphics.fillRect(barX, margin, barWidth, trackHeight);
    this.barGraphics.fillStyle(CGA_NUM.magenta, 1);
    this.barGraphics.fillRect(barX, margin + trackHeight - filledHeight, barWidth, filledHeight);
  }

  destroy() {
    this.barGraphics.destroy();
  }
}
