import Phaser from 'phaser';
import { CGA_HEX, CGA_NUM } from '../style/CgaPalette';

type MenuButtonOptions = {
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  enabled: boolean;
  onClick?: () => void;
};

export class MenuButton {
  private readonly background: Phaser.GameObjects.Rectangle;
  private readonly label: Phaser.GameObjects.Text;

  constructor(private readonly scene: Phaser.Scene, options: MenuButtonOptions) {
    this.background = this.scene.add
      .rectangle(options.x, options.y, options.width, options.height, CGA_NUM.black, 1)
      .setStrokeStyle(1, options.enabled ? CGA_NUM.cyan : CGA_NUM.magenta)
      .setDepth(120)
      .setScrollFactor(0);

    this.label = this.scene.add
      .text(options.x, options.y, options.label, {
        fontFamily: 'Courier New, monospace',
        fontSize: '16px',
        color: options.enabled ? CGA_HEX.white : CGA_HEX.magenta
      })
      .setOrigin(0.5)
      .setDepth(121)
      .setScrollFactor(0);

    if (options.enabled && options.onClick) {
      this.background.setInteractive({ useHandCursor: true });
      this.background.on('pointerdown', options.onClick);
    }
  }

  setPosition(x: number, y: number) {
    this.background.setPosition(x, y);
    this.label.setPosition(x, y);
  }

  destroy() {
    this.background.destroy();
    this.label.destroy();
  }
}
