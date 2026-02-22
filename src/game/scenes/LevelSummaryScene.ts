import Phaser from 'phaser';
import { MenuButton } from '../components/MenuButton';
import { LevelStats } from '../stats/LevelStats';
import { CGA_HEX } from '../style/CgaPalette';

type LevelSummaryData = {
  levelName: string;
  nextLevelId: string | null;
  stats: LevelStats;
};

export class LevelSummaryScene extends Phaser.Scene {
  private nextLevelId: string | null = null;
  private levelName = '';
  private stats: LevelStats = {
    score: 0,
    enemiesDestroyed: 0,
    bossesDefeated: 0,
    hitsTaken: 0
  };

  private actionButton!: MenuButton;

  constructor() {
    super('LevelSummaryScene');
  }

  init(data: LevelSummaryData) {
    this.nextLevelId = data.nextLevelId;
    this.levelName = data.levelName;
    this.stats = data.stats;
  }

  create() {
    this.cameras.main.setBackgroundColor(CGA_HEX.black);

    const isFinalScreen = !this.nextLevelId;

    this.add
      .text(this.scale.width * 0.5, this.scale.height * 0.16, isFinalScreen ? 'GAME OVER' : 'LEVEL CLEAR', {
        fontFamily: 'Courier New, monospace',
        fontSize: '24px',
        color: CGA_HEX.cyan
      })
      .setOrigin(0.5)
      .setDepth(120);

    this.add
      .text(
        this.scale.width * 0.5,
        this.scale.height * 0.23,
        isFinalScreen ? 'CONGRATULATIONS PILOT' : `COMPLETED: ${this.levelName}`,
        {
          fontFamily: 'Courier New, monospace',
          fontSize: '12px',
          color: CGA_HEX.magenta
        }
      )
      .setOrigin(0.5)
      .setDepth(120);

    const statsStartY = this.scale.height * 0.36;
    const lineStep = 30;

    this.addStatLine('SCORE', this.stats.score.toString().padStart(5, '0'), statsStartY + lineStep * 0);
    this.addStatLine('ENEMIES', String(this.stats.enemiesDestroyed), statsStartY + lineStep * 1);
    this.addStatLine('BOSSES', String(this.stats.bossesDefeated), statsStartY + lineStep * 2);
    this.addStatLine('HITS TAKEN', String(this.stats.hitsTaken), statsStartY + lineStep * 3);

    this.actionButton = new MenuButton(this, {
      label: isFinalScreen ? 'START SCREEN' : 'NEXT LEVEL',
      x: this.scale.width * 0.5,
      y: this.scale.height * 0.82,
      width: 210,
      height: 38,
      enabled: true,
      onClick: () => {
        if (this.nextLevelId) {
          this.scene.start('GameScene', { levelId: this.nextLevelId });
        } else {
          this.scene.start('StartScene');
        }
      }
    });

    this.scale.on('resize', this.onResize, this);
    this.events.once('shutdown', this.shutdown, this);
  }

  private addStatLine(label: string, value: string, y: number) {
    this.add
      .text(this.scale.width * 0.36, y, label, {
        fontFamily: 'Courier New, monospace',
        fontSize: '14px',
        color: CGA_HEX.cyan
      })
      .setOrigin(0, 0.5)
      .setDepth(120);

    this.add
      .text(this.scale.width * 0.64, y, value, {
        fontFamily: 'Courier New, monospace',
        fontSize: '14px',
        color: CGA_HEX.white
      })
      .setOrigin(1, 0.5)
      .setDepth(120);
  }

  private onResize(gameSize: Phaser.Structs.Size) {
    this.actionButton.setPosition(gameSize.width * 0.5, gameSize.height * 0.82);
  }

  private shutdown() {
    this.actionButton.destroy();
    this.scale.off('resize', this.onResize, this);
  }
}
