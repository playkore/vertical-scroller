import Phaser from 'phaser';
import { getBulletBehavior } from '../bullets/BulletBehaviorRegistry';
import { getPlayfieldBounds } from '../layout/Playfield';
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

  fire(x: number, y: number, projectile: WeaponProjectileConfig, weaponLevel = 1) {
    this.enableBody(true, x, y, true, true);
    this.setTexture(projectile.textureKey);

    const bulletScale = projectile.scale ?? 1;
    this.setScale(bulletScale);

    this.behaviorId = projectile.behaviorId;
    const behavior = getBulletBehavior(projectile.behaviorId);
    const behaviorParams = { ...(projectile.behaviorParams ?? {}) };
    const levelBonus = Math.max(0, weaponLevel - 1);

    if (projectile.behaviorParamsPerLevel && levelBonus > 0) {
      for (const [key, value] of Object.entries(projectile.behaviorParamsPerLevel)) {
        behaviorParams[key] = (behaviorParams[key] ?? 0) + (value * levelBonus);
      }
    }

    this.behaviorState = behavior.onFire({
      bullet: this,
      scene: this.scene,
      spawnX: x,
      spawnY: y,
      params: behaviorParams
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
    const bounds = getPlayfieldBounds(width, height);

    if (
      this.active
      && (this.y < -40 || this.y > height + 40 || this.x < bounds.left - 40 || this.x > bounds.right + 40)
    ) {
      this.disableBody(true, true);
      this.behaviorId = null;
      this.behaviorState = null;
    }
  }
}
