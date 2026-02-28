import Phaser from 'phaser';
import { MenuButton } from '../components/MenuButton';
import { LEVEL_REGISTRY } from '../levels/LevelRegistry';
import { CGA_HEX } from '../style/CgaPalette';
import { Rank, getProgress } from '../stats/Progression';

const ITEMS_PER_PAGE = 6;

type LevelSelectData = {
  focusedLevelId?: string;
};

type LevelRow = {
  background: Phaser.GameObjects.Rectangle;
  statusMarker: Phaser.GameObjects.Arc;
  labelText: Phaser.GameObjects.Text;
  rankText: Phaser.GameObjects.Text;
  scoreText: Phaser.GameObjects.Text;
  focused: boolean;
};

export class LevelSelectScene extends Phaser.Scene {
  private title!: Phaser.GameObjects.Text;
  private pageText!: Phaser.GameObjects.Text;
  private levelRows: LevelRow[] = [];
  private currentPage = 0;
  private totalPages = 1;
  private prevButton!: MenuButton;
  private nextButton!: MenuButton;
  private backButton!: MenuButton;
  private focusedLevelId: string | null = null;

  constructor() {
    super('LevelSelectScene');
  }

  init(data: LevelSelectData) {
    this.focusedLevelId = data.focusedLevelId ?? null;
  }

  create() {
    this.cameras.main.setBackgroundColor(CGA_HEX.black);
    const progress = getProgress();

    this.title = this.add
      .text(this.scale.width * 0.5, this.scale.height * 0.12, 'SELECT LEVEL', {
        fontFamily: 'Courier New, monospace',
        fontSize: '20px',
        color: CGA_HEX.cyan
      })
      .setOrigin(0.5)
      .setDepth(120);

    const initialMetrics = this.getLevelRowMetrics(this.scale.width, this.scale.height);

    this.levelRows = LEVEL_REGISTRY.map((level, index) => {
      const levelProgress = progress.levels[level.id];
      const completed = Boolean(levelProgress?.completed);
      const bestRank: Rank | '-' = levelProgress?.bestRank ?? '-';
      const bestScore = levelProgress ? levelProgress.bestScore.toString().padStart(5, '0') : '-----';
      const focused = level.id === this.focusedLevelId;
      const background = this.add
        .rectangle(
          initialMetrics.rowX,
          initialMetrics.baseY,
          initialMetrics.rowWidth,
          initialMetrics.rowHeight,
          0x000000,
          1
        )
        .setStrokeStyle(1, focused ? 0xff55ff : 0x55ffff)
        .setDepth(120)
        .setScrollFactor(0)
        .setInteractive({ useHandCursor: true });

      background.on('pointerdown', () => {
        this.scene.start('GameScene', {
          levelId: level.id
        });
      });

      const statusMarker = this.add
        .circle(initialMetrics.rowX, initialMetrics.baseY, 5, completed ? 0xff55ff : 0x000000, completed ? 1 : 0)
        .setStrokeStyle(1, completed ? 0xff55ff : 0x55ffff)
        .setDepth(122)
        .setScrollFactor(0);

      return {
        background,
        statusMarker,
        labelText: this.add
          .text(initialMetrics.rowX, initialMetrics.baseY, `${index + 1}. ${level.name}`, {
            fontFamily: 'Courier New, monospace',
            fontSize: '12px',
            color: CGA_HEX.white
          })
          .setOrigin(0, 0.5)
          .setDepth(122)
          .setScrollFactor(0),
        rankText: this.add
          .text(initialMetrics.rowX, initialMetrics.baseY, bestRank, {
            fontFamily: 'Courier New, monospace',
            fontSize: '11px',
            color: CGA_HEX.white
          })
          .setOrigin(1, 0.5)
          .setDepth(122)
          .setScrollFactor(0),
        scoreText: this.add
          .text(initialMetrics.rowX, initialMetrics.baseY, bestScore, {
            fontFamily: 'Courier New, monospace',
            fontSize: '11px',
            color: CGA_HEX.cyan
          })
          .setOrigin(1, 0.5)
          .setDepth(122)
          .setScrollFactor(0),
        focused
      };
    });

    this.totalPages = Math.max(1, Math.ceil(this.levelRows.length / ITEMS_PER_PAGE));

    if (this.focusedLevelId) {
      const focusedIndex = LEVEL_REGISTRY.findIndex((level) => level.id === this.focusedLevelId);
      if (focusedIndex >= 0) {
        this.currentPage = Math.floor(focusedIndex / ITEMS_PER_PAGE);
      }
    }

    this.pageText = this.add
      .text(this.scale.width * 0.5, this.scale.height * 0.77, '', {
        fontFamily: 'Courier New, monospace',
        fontSize: '14px',
        color: CGA_HEX.magenta
      })
      .setOrigin(0.5)
      .setDepth(120);

    this.prevButton = new MenuButton(this, {
      label: 'PREV',
      x: this.scale.width * 0.31,
      y: this.scale.height * 0.82,
      width: 120,
      height: 34,
      enabled: true,
      onClick: () => {
        this.changePage(-1);
      }
    });

    this.nextButton = new MenuButton(this, {
      label: 'NEXT',
      x: this.scale.width * 0.69,
      y: this.scale.height * 0.82,
      width: 120,
      height: 34,
      enabled: true,
      onClick: () => {
        this.changePage(1);
      }
    });

    this.backButton = new MenuButton(this, {
      label: 'BACK',
      x: this.scale.width * 0.5,
      y: this.scale.height * 0.9,
      width: 180,
      height: 38,
      enabled: true,
      onClick: () => {
        this.scene.start('StartScene');
      }
    });

    this.layout(this.scale.width, this.scale.height);
    this.renderPage();

    this.scale.on('resize', this.onResize, this);
    this.events.once('shutdown', this.shutdown, this);
  }

  private changePage(direction: -1 | 1) {
    const nextPage = Phaser.Math.Clamp(this.currentPage + direction, 0, this.totalPages - 1);
    if (nextPage === this.currentPage) {
      return;
    }

    this.currentPage = nextPage;
    this.renderPage();
  }

  private layout(width: number, height: number) {
    this.title.setPosition(width * 0.5, height * 0.12);

    const metrics = this.getLevelRowMetrics(width, height);

    this.levelRows.forEach((row, index) => {
      const localIndex = index % ITEMS_PER_PAGE;
      const y = metrics.baseY + metrics.rowGap * localIndex;
      const rowLeft = metrics.rowX - metrics.rowWidth * 0.5;
      const rowRight = metrics.rowX + metrics.rowWidth * 0.5;
      const statusX = rowLeft + 18;
      const labelX = rowLeft + 34;
      const scoreRight = rowRight - 10;
      const rankRight = scoreRight - row.scoreText.width - 18;

      row.background.setPosition(metrics.rowX, y);
      row.background.setSize(metrics.rowWidth, metrics.rowHeight);
      row.background.setDisplaySize(metrics.rowWidth, metrics.rowHeight);
      row.background.setStrokeStyle(1, row.focused ? 0xff55ff : 0x55ffff);
      row.statusMarker.setPosition(statusX, y);
      row.scoreText.setPosition(scoreRight, y);
      row.rankText.setPosition(rankRight, y);
      row.labelText.setPosition(labelX, y);
    });

    this.pageText.setPosition(width * 0.5, height * 0.77);
    this.prevButton.setPosition(width * 0.31, height * 0.82);
    this.nextButton.setPosition(width * 0.69, height * 0.82);
    this.backButton.setPosition(width * 0.5, height * 0.9);
  }

  private renderPage() {
    const firstIndex = this.currentPage * ITEMS_PER_PAGE;
    const lastIndex = firstIndex + ITEMS_PER_PAGE;

    this.levelRows.forEach((row, index) => {
      const visible = index >= firstIndex && index < lastIndex;
      row.background.setVisible(visible);
      row.labelText.setVisible(visible);
      row.statusMarker.setVisible(visible);
      row.rankText.setVisible(visible);
      row.scoreText.setVisible(visible);

      if (visible) {
        row.background.setInteractive({ useHandCursor: true });
      } else {
        row.background.disableInteractive();
      }
    });

    this.pageText.setText(`PAGE ${this.currentPage + 1}/${this.totalPages}`);
  }

  private onResize(gameSize: Phaser.Structs.Size) {
    this.layout(gameSize.width, gameSize.height);
    this.renderPage();
  }

  private shutdown() {
    this.levelRows.forEach((row) => {
      row.background.destroy();
      row.statusMarker.destroy();
      row.labelText.destroy();
      row.rankText.destroy();
      row.scoreText.destroy();
    });
    this.pageText.destroy();
    this.prevButton.destroy();
    this.nextButton.destroy();
    this.backButton.destroy();
    this.scale.off('resize', this.onResize, this);
  }

  private getLevelRowMetrics(width: number, height: number) {
    return {
      rowX: width * 0.5,
      rowWidth: Math.min(420, width * 0.74),
      rowHeight: Math.max(34, Math.min(42, height * 0.055)),
      baseY: height * 0.28,
      rowGap: Math.min(58, height * 0.09)
    };
  }
}
