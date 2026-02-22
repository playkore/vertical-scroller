import Phaser from 'phaser';
import { getPlayfieldBounds } from '../layout/Playfield';

type StarConfig = {
  texture: string;
  count: number;
  minSpeed: number;
  maxSpeed: number;
};

type StarData = {
  sprite: Phaser.GameObjects.Image;
  speed: number;
};

export class StarfieldLayer {
  private readonly scene: Phaser.Scene;
  private readonly stars: StarData[] = [];

  constructor(scene: Phaser.Scene, config: StarConfig) {
    this.scene = scene;

    const { width, height } = this.scene.scale;
    const bounds = getPlayfieldBounds(width, height);
    for (let i = 0; i < config.count; i += 1) {
      const sprite = this.scene.add
        .image(
          Phaser.Math.Between(bounds.left, bounds.right),
          Phaser.Math.Between(0, height),
          config.texture
        )
        .setDepth(1);

      this.stars.push({
        sprite,
        speed: Phaser.Math.FloatBetween(config.minSpeed, config.maxSpeed)
      });
    }
  }

  update(deltaSeconds: number) {
    const height = this.scene.scale.height;
    const width = this.scene.scale.width;
    const bounds = getPlayfieldBounds(width, height);

    for (const star of this.stars) {
      star.sprite.y += star.speed * deltaSeconds;
      if (star.sprite.y > height + 4) {
        star.sprite.y = -4;
        star.sprite.x = Phaser.Math.Between(bounds.left, bounds.right);
      }
    }
  }
}
