import Phaser from 'phaser';
import { MenuButton } from '../components/MenuButton';
import { ENEMY_REGISTRY } from '../enemies/EnemyRegistry';
import { CGA_HEX } from '../style/CgaPalette';

type EnemyRow = {
  icon: Phaser.GameObjects.Image;
  label: Phaser.GameObjects.Text;
};

const ITEMS_PER_PAGE = 4;

export class EnemiesScene extends Phaser.Scene {
  private title!: Phaser.GameObjects.Text;
  private pageText!: Phaser.GameObjects.Text;
  private enemyRows: EnemyRow[] = [];
  private currentPage = 0;
  private totalPages = 1;
  private prevButton!: MenuButton;
  private nextButton!: MenuButton;
  private backButton!: MenuButton;

  constructor() {
    super('EnemiesScene');
  }

  create() {
    this.cameras.main.setBackgroundColor(CGA_HEX.black);

    this.title = this.add
      .text(this.scale.width * 0.5, this.scale.height * 0.12, 'ENEMIES', {
        fontFamily: 'Courier New, monospace',
        fontSize: '20px',
        color: CGA_HEX.cyan
      })
      .setOrigin(0.5)
      .setDepth(120);

    this.enemyRows = ENEMY_REGISTRY.map((enemy) => {
      const icon = this.add.image(0, 0, enemy.textureKey).setScale(2).setDepth(120);
      const label = this.add
        .text(0, 0, `${enemy.name} (${this.formatEnemyId(enemy.id)})`, {
          fontFamily: 'Courier New, monospace',
          fontSize: '16px',
          color: CGA_HEX.white
        })
        .setOrigin(0, 0.5)
        .setDepth(120);

      return { icon, label };
    });

    this.totalPages = Math.max(1, Math.ceil(this.enemyRows.length / ITEMS_PER_PAGE));

    this.pageText = this.add
      .text(this.scale.width * 0.5, this.scale.height * 0.76, '', {
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

  private formatEnemyId(enemyId: string): string {
    return enemyId
      .split('-')
      .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
      .join(' ');
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

    const baseY = height * 0.24;
    const rowGap = Math.min(80, height * 0.125);
    const iconX = width * 0.28;
    const textX = width * 0.38;

    this.enemyRows.forEach((row, index) => {
      const localIndex = index % ITEMS_PER_PAGE;
      const y = baseY + rowGap * localIndex;
      row.icon.setPosition(iconX, y);
      row.label.setPosition(textX, y);
    });

    this.pageText.setPosition(width * 0.5, height * 0.76);
    this.prevButton.setPosition(width * 0.31, height * 0.82);
    this.nextButton.setPosition(width * 0.69, height * 0.82);
    this.backButton.setPosition(width * 0.5, height * 0.9);
  }

  private renderPage() {
    const firstIndex = this.currentPage * ITEMS_PER_PAGE;
    const lastIndex = firstIndex + ITEMS_PER_PAGE;

    this.enemyRows.forEach((row, index) => {
      const visible = index >= firstIndex && index < lastIndex;
      row.icon.setVisible(visible);
      row.label.setVisible(visible);
    });

    this.pageText.setText(`PAGE ${this.currentPage + 1}/${this.totalPages}`);
  }

  private onResize(gameSize: Phaser.Structs.Size) {
    this.layout(gameSize.width, gameSize.height);
    this.renderPage();
  }

  private shutdown() {
    this.enemyRows.forEach((row) => {
      row.icon.destroy();
      row.label.destroy();
    });
    this.pageText.destroy();
    this.prevButton.destroy();
    this.nextButton.destroy();
    this.backButton.destroy();
    this.scale.off('resize', this.onResize, this);
  }
}
