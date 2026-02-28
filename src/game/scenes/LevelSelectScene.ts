import Phaser from 'phaser';
import { MenuButton } from '../components/MenuButton';
import { LEVEL_REGISTRY } from '../levels/LevelRegistry';
import { CGA_HEX } from '../style/CgaPalette';
import { Rank, getProgress } from '../stats/Progression';

const ITEMS_PER_PAGE = 6;

type LevelSelectData = {
  focusedLevelId?: string;
};

type TileMetaText = {
  rankText: Phaser.GameObjects.Text;
  scoreText: Phaser.GameObjects.Text;
  completedText: Phaser.GameObjects.Text;
};

export class LevelSelectScene extends Phaser.Scene {
  private title!: Phaser.GameObjects.Text;
  private pageText!: Phaser.GameObjects.Text;
  private levelButtons: MenuButton[] = [];
  private tileMetaTexts: TileMetaText[] = [];
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

    this.levelButtons = LEVEL_REGISTRY.map((level, index) => {
      const levelProgress = progress.levels[level.id];
      const bestRank: Rank | '-' = levelProgress?.bestRank ?? '-';
      const bestScore = levelProgress ? levelProgress.bestScore.toString().padStart(5, '0') : '-----';
      const completed = levelProgress?.completed ? 'COMPLETED' : 'INCOMPLETE';

      const button = new MenuButton(this, {
        label: `L${index + 1}: ${level.name}`,
        x: this.scale.width * 0.42,
        y: this.scale.height * 0.3,
        width: 190,
        height: 34,
        enabled: true,
        onClick: () => {
          this.scene.start('GameScene', {
            levelId: level.id
          });
        }
      });

      this.tileMetaTexts.push({
        rankText: this.add
          .text(this.scale.width * 0.73, this.scale.height * 0.3, `R ${bestRank}`, {
            fontFamily: 'Courier New, monospace',
            fontSize: '12px',
            color: CGA_HEX.white
          })
          .setOrigin(0.5)
          .setDepth(122),
        scoreText: this.add
          .text(this.scale.width * 0.87, this.scale.height * 0.3, `S ${bestScore}`, {
            fontFamily: 'Courier New, monospace',
            fontSize: '12px',
            color: CGA_HEX.cyan
          })
          .setOrigin(0.5)
          .setDepth(122),
        completedText: this.add
          .text(this.scale.width * 0.18, this.scale.height * 0.3, completed, {
            fontFamily: 'Courier New, monospace',
            fontSize: '10px',
            color: levelProgress?.completed ? CGA_HEX.magenta : CGA_HEX.white
          })
          .setOrigin(0.5)
          .setDepth(122)
      });

      return button;
    });

    this.totalPages = Math.max(1, Math.ceil(this.levelButtons.length / ITEMS_PER_PAGE));

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

    const buttonX = width * 0.42;
    const rankX = width * 0.73;
    const scoreX = width * 0.87;
    const completedX = width * 0.18;
    const baseY = height * 0.28;
    const rowGap = Math.min(58, height * 0.09);

    this.levelButtons.forEach((button, index) => {
      const localIndex = index % ITEMS_PER_PAGE;
      const y = baseY + rowGap * localIndex;
      button.setPosition(buttonX, y);
      this.tileMetaTexts[index].rankText.setPosition(rankX, y);
      this.tileMetaTexts[index].scoreText.setPosition(scoreX, y);
      this.tileMetaTexts[index].completedText.setPosition(completedX, y);
    });

    this.pageText.setPosition(width * 0.5, height * 0.77);
    this.prevButton.setPosition(width * 0.31, height * 0.82);
    this.nextButton.setPosition(width * 0.69, height * 0.82);
    this.backButton.setPosition(width * 0.5, height * 0.9);
  }

  private renderPage() {
    const firstIndex = this.currentPage * ITEMS_PER_PAGE;
    const lastIndex = firstIndex + ITEMS_PER_PAGE;

    this.levelButtons.forEach((button, index) => {
      const visible = index >= firstIndex && index < lastIndex;
      button.setVisible(visible);
      this.tileMetaTexts[index].rankText.setVisible(visible);
      this.tileMetaTexts[index].scoreText.setVisible(visible);
      this.tileMetaTexts[index].completedText.setVisible(visible);
    });

    this.pageText.setText(`PAGE ${this.currentPage + 1}/${this.totalPages}`);
  }

  private onResize(gameSize: Phaser.Structs.Size) {
    this.layout(gameSize.width, gameSize.height);
    this.renderPage();
  }

  private shutdown() {
    this.levelButtons.forEach((button) => {
      button.destroy();
    });
    this.tileMetaTexts.forEach((tile) => {
      tile.rankText.destroy();
      tile.scoreText.destroy();
      tile.completedText.destroy();
    });
    this.pageText.destroy();
    this.prevButton.destroy();
    this.nextButton.destroy();
    this.backButton.destroy();
    this.scale.off('resize', this.onResize, this);
  }
}
