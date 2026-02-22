import Phaser from 'phaser';

type BulletFireOptions = {
  velocityX: number;
  velocityY: number;
  textureKey: string;
  scale?: number;
};

export class PlayerBullet extends Phaser.Physics.Arcade.Image {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'bullet-laser');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setActive(false);
    this.setVisible(false);
  }

  fire(x: number, y: number, options: BulletFireOptions) {
    this.enableBody(true, x, y, true, true);
    this.setTexture(options.textureKey);

    const bulletScale = options.scale ?? 1;
    this.setScale(bulletScale);
    this.setVelocity(options.velocityX, options.velocityY);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(this.displayWidth, this.displayHeight, true);
  }

  preUpdate(_time: number, _delta: number): void {
    const width = this.scene.scale.width;

    if (this.active && (this.y < -24 || this.x < -24 || this.x > width + 24)) {
      this.disableBody(true, true);
    }
  }
}
