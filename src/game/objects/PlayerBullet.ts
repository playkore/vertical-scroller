import Phaser from 'phaser';
import { getBulletBehavior } from '../bullets/BulletBehaviorRegistry';
import { WeaponProjectileConfig } from '../ships/ShipDefinition';

export class PlayerBullet extends Phaser.Physics.Arcade.Image {
  private behaviorId: string | null = null;
  private behaviorState: unknown = null;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'bullet-laser');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setActive(false);
    this.setVisible(false);
  }

  fire(x: number, y: number, projectile: WeaponProjectileConfig) {
    this.enableBody(true, x, y, true, true);
    this.setTexture(projectile.textureKey);

    const bulletScale = projectile.scale ?? 1;
    this.setScale(bulletScale);

    this.behaviorId = projectile.behaviorId;
    const behavior = getBulletBehavior(projectile.behaviorId);

    this.behaviorState = behavior.onFire({
      bullet: this,
      scene: this.scene,
      spawnX: x,
      spawnY: y,
      params: projectile.behaviorParams ?? {}
    });

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(this.displayWidth, this.displayHeight, true);
    body.updateFromGameObject();
  }

  preUpdate(_time: number, delta: number): void {
    if (this.behaviorId) {
      const behavior = getBulletBehavior(this.behaviorId);
      behavior.onUpdate?.({
        bullet: this,
        scene: this.scene,
        deltaSeconds: delta / 1000,
        state: this.behaviorState
      });
    }

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.updateFromGameObject();

    const width = this.scene.scale.width;
    const height = this.scene.scale.height;

    if (this.active && (this.y < -40 || this.y > height + 40 || this.x < -40 || this.x > width + 40)) {
      this.disableBody(true, true);
      this.behaviorId = null;
      this.behaviorState = null;
    }
  }
}
