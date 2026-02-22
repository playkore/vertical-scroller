import Phaser from 'phaser';

export class PlayerBullet extends Phaser.Physics.Arcade.Image {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player-bullet');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setActive(false);
    this.setVisible(false);
  }

  fire(x: number, y: number) {
    this.enableBody(true, x, y, true, true);
    this.setVelocityY(-430);
  }

  preUpdate(_time: number, _delta: number): void {
    if (this.active && this.y < -10) {
      this.disableBody(true, true);
    }
  }
}
