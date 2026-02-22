import Phaser from 'phaser';

export class PlayerShip extends Phaser.Physics.Arcade.Sprite {
  private readonly speed = 300;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player-ship');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.setDepth(20);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(12, 14);
    body.setOffset(2, 1);
  }

  moveToward(targetX: number, targetY: number, deltaSeconds: number) {
    const blend = Phaser.Math.Clamp(deltaSeconds * 12, 0, 1);
    this.x = Phaser.Math.Linear(this.x, targetX, blend);
    this.y = Phaser.Math.Linear(this.y, targetY, blend);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.updateFromGameObject();
  }

  getSpeed(): number {
    return this.speed;
  }
}
