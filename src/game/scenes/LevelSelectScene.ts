import Phaser from 'phaser';
import { MenuButton } from '../components/MenuButton';
import { LEVEL_REGISTRY } from '../levels/LevelRegistry';
import { CGA_HEX } from '../style/CgaPalette';

const ITEMS_PER_PAGE = 6;

export class LevelSelectScene extends Phaser.Scene {
  private title!: Phaser.GameObjects.Text;
  private pageText!: Phaser.GameObjects.Text;
  private levelButtons: MenuButton[] = [];
  private currentPage = 0;
  private totalPages = 1;
  private prevButton!: MenuButton;
  private nextButton!: MenuButton;
  private backButton!: MenuButton;

  constructor() {
    super('LevelSelectScene');
  }

  create() {
    this.cameras.main.setBackgroundColor(CGA_HEX.black);

    this.title = this.add
      .text(this.scale.width * 0.5, this.scale.height * 0.16, 'SELECT LEVEL', {
        fontFamily: 'Courier New, monospace',
        fontSize: '20px',
        color: CGA_HEX.cyan
      })
      .setOrigin(0.5)
      .setDepth(120);

    this.levelButtons = LEVEL_REGISTRY.map((level, index) => {
      return new MenuButton(this, {
        label: `L${index + 1}: ${level.name}`,
        x: this.scale.width * 0.5,
        y: this.scale.height * 0.3,
        width: 250,
        height: 34,
        enabled: true,
        onClick: () => {
          this.scene.start('GameScene', {
            levelId: level.id
          });
        }
      });
    });

    this.totalPages = Math.max(1, Math.ceil(this.levelButtons.length / ITEMS_PER_PAGE));

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
    this.title.setPosition(width * 0.5, height * 0.16);

    const centerX = width * 0.5;
    const baseY = height * 0.28;
    const rowGap = Math.min(58, height * 0.09);

    this.levelButtons.forEach((button, index) => {
      const localIndex = index % ITEMS_PER_PAGE;
      button.setPosition(centerX, baseY + rowGap * localIndex);
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
    this.pageText.destroy();
    this.prevButton.destroy();
    this.nextButton.destroy();
    this.backButton.destroy();
    this.scale.off('resize', this.onResize, this);
  }
}
