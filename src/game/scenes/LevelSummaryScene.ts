import Phaser from 'phaser';
import { MenuButton } from '../components/MenuButton';
import { LevelRunSummaryData } from '../stats/LevelStats';
import { CGA_HEX } from '../style/CgaPalette';
import { Rank, getProgress, saveLevelResult } from '../stats/Progression';

type LevelSummaryData = {
  levelName: string;
  nextLevelId: string | null;
  stats: LevelRunSummaryData;
};

type SummaryLine = {
  label: Phaser.GameObjects.Text;
  value: Phaser.GameObjects.Text;
  yRatio: number;
};

type AchievementBadge = {
  label: Phaser.GameObjects.Text;
  unlockedText: Phaser.GameObjects.Text | null;
  xRatio: number;
  yRatio: number;
};

export class LevelSummaryScene extends Phaser.Scene {
  private nextLevelId: string | null = null;
  private levelName = '';
  private stats: LevelRunSummaryData = {
    levelId: '',
    score: 0,
    enemiesDestroyed: 0,
    bossesDefeated: 0,
    hitsTaken: 0,
    durationMs: 0,
    bossConfigured: false,
    enemiesSpawned: 0,
    perfectKillThreshold: 1
  };

  private summaryLines: SummaryLine[] = [];
  private achievementBadges: AchievementBadge[] = [];
  private buttons: MenuButton[] = [];

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

    const persisted = saveLevelResult(this.stats);
    const pb = getProgress().levels[this.stats.levelId] ?? persisted.updatedBest;

    this.add
      .text(this.scale.width * 0.5, this.scale.height * 0.12, 'LEVEL SUMMARY', {
        fontFamily: 'Courier New, monospace',
        fontSize: '24px',
        color: CGA_HEX.cyan
      })
      .setOrigin(0.5)
      .setDepth(120);

    this.add
      .text(this.scale.width * 0.5, this.scale.height * 0.18, `COMPLETED: ${this.levelName}`, {
        fontFamily: 'Courier New, monospace',
        fontSize: '12px',
        color: CGA_HEX.magenta
      })
      .setOrigin(0.5)
      .setDepth(120);

    this.addSummaryLine('SCORE', this.stats.score.toString().padStart(5, '0'), 0.30);
    this.addSummaryLine('RANK', persisted.rank, 0.35);
    this.addSummaryLine('ENEMIES', String(this.stats.enemiesDestroyed), 0.4);
    this.addSummaryLine('BOSSES', String(this.stats.bossesDefeated), 0.45);
    this.addSummaryLine('HITS TAKEN', String(this.stats.hitsTaken), 0.5);

    this.addSummaryLine('PB SCORE', pb.bestScore.toString().padStart(5, '0'), 0.58);
    this.addSummaryLine('PB RANK', pb.bestRank, 0.63);

    this.add
      .text(
        this.scale.width * 0.5,
        this.scale.height * 0.69,
        persisted.isNewRecord ? 'NEW RECORD!' : 'NO NEW RECORD',
        {
          fontFamily: 'Courier New, monospace',
          fontSize: '14px',
          color: persisted.isNewRecord ? CGA_HEX.cyan : CGA_HEX.magenta
        }
      )
      .setOrigin(0.5)
      .setDepth(120);

    this.addAchievementBadge(
      'NO-HIT',
      persisted.updatedAchievements.noHit,
      persisted.unlockedAchievements.includes('noHit'),
      0.33,
      0.75
    );
    this.addAchievementBadge(
      'PERFECT',
      persisted.updatedAchievements.perfect,
      persisted.unlockedAchievements.includes('perfect'),
      0.67,
      0.75
    );

    this.buttons = [
      new MenuButton(this, {
        label: 'NEXT LEVEL',
        x: this.scale.width * 0.28,
        y: this.scale.height * 0.83,
        width: 145,
        height: 32,
        enabled: Boolean(this.nextLevelId),
        onClick: () => {
          if (!this.nextLevelId) {
            return;
          }

          this.scene.start('GameScene', { levelId: this.nextLevelId });
        }
      }),
      new MenuButton(this, {
        label: 'RETRY LEVEL',
        x: this.scale.width * 0.72,
        y: this.scale.height * 0.83,
        width: 145,
        height: 32,
        enabled: true,
        onClick: () => {
          this.scene.start('GameScene', { levelId: this.stats.levelId });
        }
      }),
      new MenuButton(this, {
        label: 'LEVEL SELECT',
        x: this.scale.width * 0.28,
        y: this.scale.height * 0.9,
        width: 145,
        height: 32,
        enabled: true,
        onClick: () => {
          this.scene.start('LevelSelectScene', { focusedLevelId: this.stats.levelId });
        }
      }),
      new MenuButton(this, {
        label: 'MAIN MENU',
        x: this.scale.width * 0.72,
        y: this.scale.height * 0.9,
        width: 145,
        height: 32,
        enabled: true,
        onClick: () => {
          this.scene.start('StartScene');
        }
      })
    ];

    this.scale.on('resize', this.onResize, this);
    this.events.once('shutdown', this.shutdown, this);
  }

  private addSummaryLine(label: string, value: string | Rank, yRatio: number) {
    this.summaryLines.push({
      label: this.add
        .text(this.scale.width * 0.2, this.scale.height * yRatio, label, {
          fontFamily: 'Courier New, monospace',
          fontSize: '14px',
          color: CGA_HEX.cyan
        })
        .setOrigin(0, 0.5)
        .setDepth(120),
      value: this.add
        .text(this.scale.width * 0.8, this.scale.height * yRatio, value, {
          fontFamily: 'Courier New, monospace',
          fontSize: '14px',
          color: CGA_HEX.white
        })
        .setOrigin(1, 0.5)
        .setDepth(120),
      yRatio
    });
  }

  private addAchievementBadge(
    label: string,
    unlocked: boolean,
    isFirstUnlock: boolean,
    xRatio: number,
    yRatio: number
  ) {
    const labelText = this.add
      .text(this.scale.width * xRatio, this.scale.height * yRatio, label, {
        fontFamily: 'Courier New, monospace',
        fontSize: '16px',
        color: unlocked ? CGA_HEX.cyan : CGA_HEX.magenta
      })
      .setOrigin(0.5)
      .setAlpha(unlocked ? 1 : 0.45)
      .setDepth(120);

    const unlockedText = isFirstUnlock
      ? this.add
          .text(this.scale.width * xRatio, this.scale.height * (yRatio + 0.04), 'UNLOCKED', {
            fontFamily: 'Courier New, monospace',
            fontSize: '10px',
            color: CGA_HEX.white
          })
          .setOrigin(0.5)
          .setDepth(120)
      : null;

    this.achievementBadges.push({
      label: labelText,
      unlockedText,
      xRatio,
      yRatio
    });
  }

  private onResize(gameSize: Phaser.Structs.Size) {
    for (const line of this.summaryLines) {
      line.label.setPosition(gameSize.width * 0.2, gameSize.height * line.yRatio);
      line.value.setPosition(gameSize.width * 0.8, gameSize.height * line.yRatio);
    }

    for (const badge of this.achievementBadges) {
      badge.label.setPosition(gameSize.width * badge.xRatio, gameSize.height * badge.yRatio);
      badge.unlockedText?.setPosition(
        gameSize.width * badge.xRatio,
        gameSize.height * (badge.yRatio + 0.04)
      );
    }

    this.buttons[0].setPosition(gameSize.width * 0.28, gameSize.height * 0.83);
    this.buttons[1].setPosition(gameSize.width * 0.72, gameSize.height * 0.83);
    this.buttons[2].setPosition(gameSize.width * 0.28, gameSize.height * 0.9);
    this.buttons[3].setPosition(gameSize.width * 0.72, gameSize.height * 0.9);
  }

  private shutdown() {
    for (const button of this.buttons) {
      button.destroy();
    }

    for (const line of this.summaryLines) {
      line.label.destroy();
      line.value.destroy();
    }

    for (const badge of this.achievementBadges) {
      badge.label.destroy();
      badge.unlockedText?.destroy();
    }

    this.scale.off('resize', this.onResize, this);
  }
}
