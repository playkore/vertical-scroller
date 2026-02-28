import Phaser from 'phaser';
import { getPlayfieldBounds } from '../layout/Playfield';
import { resolveScoreConfig } from '../stats/ScoreConfig';
import type { ScoreConfig } from '../stats/ScoreConfig';
import { CGA_HEX, CGA_NUM } from '../style/CgaPalette';

export interface ScoreChainState {
  chainCount: number;
  remainingMs: number;
  windowMs: number;
}

// Centralized score logic that owns combo state and the related HUD elements.
export class ScoreDirector {
  private readonly config: ScoreConfig;
  private readonly scoreText: Phaser.GameObjects.Text;
  private readonly multiplierText: Phaser.GameObjects.Text;
  private readonly chainBarTrack: Phaser.GameObjects.Rectangle;
  private readonly chainBarFill: Phaser.GameObjects.Rectangle;

  private score = 0;
  private multiplier: number;
  private chainCount = 0;
  private chainTimerMs = 0;
  private maxMultiplier: number;
  private maxChainCount = 0;
  private chainBarWidth = 0;

  constructor(
    private readonly scene: Phaser.Scene,
    configOverride?: Partial<ScoreConfig>
  ) {
    this.config = resolveScoreConfig(configOverride);
    this.multiplier = this.config.minMultiplier;
    this.maxMultiplier = this.config.minMultiplier;

    this.scoreText = this.scene.add
      .text(0, 0, 'SCORE 00000', {
        fontFamily: 'Courier New, monospace',
        fontSize: '14px',
        color: CGA_HEX.white
      })
      .setDepth(100)
      .setScrollFactor(0);

    this.multiplierText = this.scene.add
      .text(0, 0, 'x1.0', {
        fontFamily: 'Courier New, monospace',
        fontSize: '12px',
        color: CGA_HEX.magenta
      })
      .setDepth(100)
      .setScrollFactor(0);

    this.chainBarTrack = this.scene.add
      .rectangle(0, 0, 1, 6, CGA_NUM.black, 1)
      .setOrigin(0, 0.5)
      .setStrokeStyle(1, CGA_NUM.cyan)
      .setDepth(100)
      .setScrollFactor(0);

    this.chainBarFill = this.scene.add
      .rectangle(0, 0, 1, 4, CGA_NUM.cyan, 1)
      .setOrigin(0, 0.5)
      .setDepth(101)
      .setScrollFactor(0);

    this.onResize(this.scene.scale.width, this.scene.scale.height);
    this.refreshHud();
  }

  onEnemyKilled() {
    this.chainCount = this.chainTimerMs > 0 ? this.chainCount + 1 : 1;
    this.chainTimerMs = this.config.chainWindowMs;
    this.multiplier = Phaser.Math.Clamp(
      this.config.minMultiplier + this.chainCount * this.config.multiplierStep,
      this.config.minMultiplier,
      this.config.maxMultiplier
    );

    this.score += Math.floor(this.config.baseKillScore);
    this.maxMultiplier = Math.max(this.maxMultiplier, this.multiplier);
    this.maxChainCount = Math.max(this.maxChainCount, this.chainCount);

    this.refreshHud();
  }

  onPlayerHit() {
    this.resetChain();
    this.refreshHud();
  }

  update(deltaMs: number) {
    if (this.chainTimerMs <= 0) {
      return;
    }

    this.chainTimerMs = Math.max(0, this.chainTimerMs - deltaMs);
    if (this.chainTimerMs === 0) {
      this.resetChain();
      this.refreshHud();
      return;
    }

    this.refreshChainBar();
  }

  onResize(width: number, height: number) {
    const bounds = getPlayfieldBounds(width, height);
    const left = bounds.left + 10;

    this.scoreText.setPosition(left, 10);
    this.multiplierText.setPosition(left, 60);

    this.chainBarWidth = Math.max(48, Math.floor(bounds.sidePanelWidth - 20));
    this.chainBarTrack.setPosition(left, 78);
    this.chainBarTrack.setSize(this.chainBarWidth, 6);
    this.chainBarTrack.setDisplaySize(this.chainBarWidth, 6);

    this.chainBarFill.setPosition(left + 1, 78);
    this.refreshChainBar();
  }

  destroy() {
    this.scoreText.destroy();
    this.multiplierText.destroy();
    this.chainBarTrack.destroy();
    this.chainBarFill.destroy();
  }

  getScore() {
    return this.score;
  }

  getMultiplier() {
    return this.multiplier;
  }

  getChainState(): ScoreChainState {
    return {
      chainCount: this.chainCount,
      remainingMs: this.chainTimerMs,
      windowMs: this.config.chainWindowMs
    };
  }

  getMaxMultiplier() {
    return this.maxMultiplier;
  }

  getMaxChainCount() {
    return this.maxChainCount;
  }

  private refreshHud() {
    this.scoreText.setText(`SCORE ${this.score.toString().padStart(5, '0')}`);
    this.multiplierText
      .setText(`x${this.multiplier.toFixed(1)}`)
      .setColor(this.chainTimerMs > 0 ? CGA_HEX.magenta : CGA_HEX.white)
      .setAlpha(this.chainTimerMs > 0 ? 1 : 0.7);
    this.refreshChainBar();
  }

  private refreshChainBar() {
    const ratio =
      this.config.chainWindowMs > 0
        ? Phaser.Math.Clamp(this.chainTimerMs / this.config.chainWindowMs, 0, 1)
        : 0;
    const fillWidth = Math.max(0, Math.floor((this.chainBarWidth - 2) * ratio));

    this.chainBarFill.setVisible(fillWidth > 0);
    if (fillWidth > 0) {
      this.chainBarFill.setSize(fillWidth, 4);
      this.chainBarFill.setDisplaySize(fillWidth, 4);
    }
  }

  private resetChain() {
    this.multiplier = this.config.minMultiplier;
    this.chainCount = 0;
    this.chainTimerMs = 0;
  }
}
