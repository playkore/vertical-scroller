import Phaser from 'phaser';
import { getPlayfieldBounds } from '../layout/Playfield';
import { PlayerShip } from '../objects/PlayerShip';

export class TouchController {
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
    const bounds = getPlayfieldBounds(width, height);

    // X mapping: distance from screen center is amplified by 2.
    const screenMidX = width * 0.5;
    const shipTargetX = screenMidX + (pointer.worldX - screenMidX) * 2;

    // Y mapping: distance from screen bottom is amplified by 2.
    const distanceToBottom = height - pointer.worldY;
    const shipTargetY = height - distanceToBottom * 2;

    this.targetX = Phaser.Math.Clamp(shipTargetX, bounds.left + 12, bounds.right - 12);
    this.targetY = Phaser.Math.Clamp(shipTargetY, 12, height - this.bottomPadding);
  }

  update(deltaSeconds: number) {
    this.player.moveToward(this.targetX, this.targetY, deltaSeconds);
  }

  syncTargetToPlayer() {
    this.targetX = this.player.x;
    this.targetY = this.player.y;
  }

  destroy() {
    this.scene.input.off('pointerdown', this.onPointerMove, this);
    this.scene.input.off('pointermove', this.onPointerMove, this);
  }
}
