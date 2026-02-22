import Phaser from 'phaser';

export class EnemyShip extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'enemy-ship');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setActive(false);
    this.setVisible(false);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(12, 12);
    body.setOffset(2, 2);
  }

  spawn(x: number, y: number, speed: number) {
    this.enableBody(true, x, y, true, true);
    this.setVelocityY(speed);
  }

  preUpdate(_time: number, _delta: number): void {
    if (this.active && this.y > this.scene.scale.height + 16) {
      this.disableBody(true, true);
    }
  }
}
