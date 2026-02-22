import Phaser from 'phaser';
import { MenuButton } from '../components/MenuButton';
import { LEVEL_REGISTRY } from '../levels/LevelRegistry';
import { CGA_HEX } from '../style/CgaPalette';

export class LevelSelectScene extends Phaser.Scene {
  private levelButtons: MenuButton[] = [];
  private backButton!: MenuButton;

  constructor() {
    super('LevelSelectScene');
  }

  create() {
    this.cameras.main.setBackgroundColor(CGA_HEX.black);

    this.add
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
        y: this.scale.height * (0.28 + index * 0.1),
        width: 240,
        height: 38,
        enabled: true,
        onClick: () => {
          this.scene.start('GameScene', {
            levelId: level.id
          });
        }
      });
    });

    this.backButton = new MenuButton(this, {
      label: 'BACK',
      x: this.scale.width * 0.5,
      y: this.scale.height * 0.86,
      width: 180,
      height: 38,
      enabled: true,
      onClick: () => {
        this.scene.start('StartScene');
      }
    });

    this.scale.on('resize', this.onResize, this);
    this.events.once('shutdown', this.shutdown, this);
  }

  private onResize(gameSize: Phaser.Structs.Size) {
    const centerX = gameSize.width * 0.5;

    this.levelButtons.forEach((button, index) => {
      button.setPosition(centerX, gameSize.height * (0.28 + index * 0.1));
    });

    this.backButton.setPosition(centerX, gameSize.height * 0.86);
  }

  private shutdown() {
    this.levelButtons.forEach((button) => {
      button.destroy();
    });
    this.backButton.destroy();
    this.scale.off('resize', this.onResize, this);
  }
}
