import Phaser from 'phaser';
import { MenuButton } from '../components/MenuButton';
import { ENEMY_REGISTRY } from '../enemies/EnemyRegistry';
import { CGA_HEX } from '../style/CgaPalette';

type EnemyRow = {
  icon: Phaser.GameObjects.Image;
  label: Phaser.GameObjects.Text;
};

export class EnemiesScene extends Phaser.Scene {
  private title!: Phaser.GameObjects.Text;
  private enemyRows: EnemyRow[] = [];
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

    this.backButton = new MenuButton(this, {
      label: 'BACK',
      x: this.scale.width * 0.5,
      y: this.scale.height * 0.88,
      width: 180,
      height: 38,
      enabled: true,
      onClick: () => {
        this.scene.start('StartScene');
      }
    });

    this.layout(this.scale.width, this.scale.height);

    this.scale.on('resize', this.onResize, this);
    this.events.once('shutdown', this.shutdown, this);
  }

  private formatEnemyId(enemyId: string): string {
    return enemyId
      .split('-')
      .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
      .join(' ');
  }

  private layout(width: number, height: number) {
    this.title.setPosition(width * 0.5, height * 0.12);

    const baseY = height * 0.28;
    const rowGap = Math.min(92, height * 0.16);
    const iconX = width * 0.28;
    const textX = width * 0.38;

    this.enemyRows.forEach((row, index) => {
      const y = baseY + rowGap * index;
      row.icon.setPosition(iconX, y);
      row.label.setPosition(textX, y);
    });

    this.backButton.setPosition(width * 0.5, height * 0.88);
  }

  private onResize(gameSize: Phaser.Structs.Size) {
    this.layout(gameSize.width, gameSize.height);
  }

  private shutdown() {
    this.enemyRows.forEach((row) => {
      row.icon.destroy();
      row.label.destroy();
    });
    this.backButton.destroy();
    this.scale.off('resize', this.onResize, this);
  }
}
