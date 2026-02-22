import Phaser from 'phaser';
import { PlayerShip } from '../objects/PlayerShip';

export class TouchController {
  private readonly fingerOffsetY = 56;
  private readonly scene: Phaser.Scene;
  private readonly player: PlayerShip;
  private readonly bottomPadding: number;
  private targetX: number;
  private targetY: number;

  constructor(scene: Phaser.Scene, player: PlayerShip, bottomPadding = 20) {
    this.scene = scene;
    this.player = player;
    this.bottomPadding = bottomPadding;
    this.targetX = player.x;
    this.targetY = player.y;

    this.scene.input.addPointer(1);

    this.scene.input.on('pointerdown', this.onPointerMove, this);
    this.scene.input.on('pointermove', this.onPointerMove, this);
  }

  private onPointerMove(pointer: Phaser.Input.Pointer) {
    if (!pointer.isDown && pointer.event.type !== 'pointerdown') {
      return;
    }

    const width = this.scene.scale.width;
    const height = this.scene.scale.height;
    const shipTargetY = pointer.worldY - this.fingerOffsetY;

    this.targetX = Phaser.Math.Clamp(pointer.worldX, 12, width - 12);
    this.targetY = Phaser.Math.Clamp(shipTargetY, height * 0.45, height - this.bottomPadding);
  }

  update(deltaSeconds: number) {
    this.player.moveToward(this.targetX, this.targetY, deltaSeconds);
  }

  destroy() {
    this.scene.input.off('pointerdown', this.onPointerMove, this);
    this.scene.input.off('pointermove', this.onPointerMove, this);
  }
}
