import Phaser from 'phaser';
import { CGA_HEX, CGA_NUM } from '../style/CgaPalette';
import { ShipDefinition } from '../ships/ShipDefinition';

const BUTTON_HEIGHT = 34;
const BOTTOM_PADDING = 8;

interface ButtonEntry {
  id: string;
  bg: Phaser.GameObjects.Rectangle;
  text: Phaser.GameObjects.Text;
}

export class ShipSelectorUI {
  static readonly reservedHeight = BUTTON_HEIGHT + BOTTOM_PADDING + 20;

  private readonly scene: Phaser.Scene;
  private readonly buttons: ButtonEntry[] = [];
  private activeId: string;

  constructor(
    scene: Phaser.Scene,
    ships: ShipDefinition[],
    defaultShipId: string,
    onSelect: (ship: ShipDefinition) => void
  ) {
    this.scene = scene;
    this.activeId = defaultShipId;

    ships.forEach((ship) => {
      const bg = this.scene.add
        .rectangle(0, 0, 70, BUTTON_HEIGHT, CGA_NUM.black, 0.85)
        .setStrokeStyle(2, CGA_NUM.cyan)
        .setDepth(100)
        .setScrollFactor(0)
        .setInteractive({ useHandCursor: true });

      const text = this.scene.add
        .text(0, 0, ship.name, {
          fontFamily: 'Courier New, monospace',
          fontSize: '14px',
          color: CGA_HEX.cyan
        })
        .setDepth(101)
        .setOrigin(0.5)
        .setScrollFactor(0);

      bg.on('pointerdown', () => {
        this.setActive(ship.id);
        onSelect(ship);
      });

      this.buttons.push({ id: ship.id, bg, text });
    });

    this.setActive(defaultShipId);
    this.layout(this.scene.scale.width, this.scene.scale.height);
  }

  layout(width: number, height: number) {
    const spacing = 10;
    const buttonWidth = Math.min(92, (width - spacing * 4) / Math.max(1, this.buttons.length));
    const totalWidth =
      buttonWidth * this.buttons.length + spacing * Math.max(0, this.buttons.length - 1);
    const startX = (width - totalWidth) * 0.5;
    const y = height - BOTTOM_PADDING - BUTTON_HEIGHT * 0.5;

    this.buttons.forEach((button, index) => {
      const x = startX + index * (buttonWidth + spacing) + buttonWidth * 0.5;
      button.bg.setPosition(x, y).setSize(buttonWidth, BUTTON_HEIGHT);
      button.text.setPosition(x, y);
    });
  }

  destroy() {
    this.buttons.forEach((button) => {
      button.bg.destroy();
      button.text.destroy();
    });
  }

  private setActive(id: string) {
    this.activeId = id;

    this.buttons.forEach((button) => {
      const isActive = button.id === this.activeId;
      button.bg.setStrokeStyle(2, isActive ? CGA_NUM.white : CGA_NUM.cyan);
      button.bg.setFillStyle(isActive ? CGA_NUM.magenta : CGA_NUM.black, isActive ? 0.95 : 0.85);
      button.text.setColor(isActive ? CGA_HEX.white : CGA_HEX.cyan);
    });
  }
}
