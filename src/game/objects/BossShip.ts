import Phaser from 'phaser';
import { BossDefinition } from '../bosses/BossDefinition';
import { getPlayfieldBounds } from '../layout/Playfield';

export class BossShip extends Phaser.Physics.Arcade.Sprite {
  private definition: BossDefinition | null = null;
  private movementState: unknown = null;
  private ageSeconds = 0;
  private maxHealth = 0;
  private health = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'boss-alpha-core');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setActive(false);
    this.setVisible(false);
    this.setDepth(40);
  }

  spawn(definition: BossDefinition, x: number, y: number) {
    this.definition = definition;
    this.maxHealth = definition.health;
    this.health = definition.health;
    this.ageSeconds = 0;

    this.enableBody(true, x, y, true, true);
    this.setTexture(definition.textureKey);
    this.setVelocity(0, 0);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(definition.collider.width, definition.collider.height);
    body.setOffset(definition.collider.offsetX, definition.collider.offsetY);

    const bounds = getPlayfieldBounds(this.scene.scale.width, this.scene.scale.height);

    this.movementState = definition.movement.onSpawn?.({
      boss: this,
      scene: this.scene,
      spawnX: x,
      spawnY: y,
      playfieldLeft: bounds.left,
      playfieldRight: bounds.right
    });

    body.updateFromGameObject();
  }

  takeHit(damage: number): boolean {
    this.health -= damage;
    this.setTint(0xffffff);
    this.scene.time.delayedCall(60, () => {
      if (this.active) {
        this.clearTint();
      }
    });

    if (this.health > 0) {
      return false;
    }

    this.disableBody(true, true);
    this.definition = null;
    this.movementState = null;
    this.ageSeconds = 0;
    this.maxHealth = 0;
    this.health = 0;
    return true;
  }

  getHealthRatio(): number {
    if (!this.active || this.maxHealth <= 0) {
      return 0;
    }

    return Phaser.Math.Clamp(this.health / this.maxHealth, 0, 1);
  }

  preUpdate(_time: number, delta: number): void {
    if (!this.active || !this.definition) {
      return;
    }

    const dt = delta / 1000;
    this.ageSeconds += dt;

    const bounds = getPlayfieldBounds(this.scene.scale.width, this.scene.scale.height);

    this.definition.movement.onUpdate?.({
      boss: this,
      scene: this.scene,
      deltaSeconds: dt,
      ageSeconds: this.ageSeconds,
      state: this.movementState,
      playfieldLeft: bounds.left,
      playfieldRight: bounds.right
    });

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.updateFromGameObject();

    if (this.y > this.scene.scale.height + 90) {
      this.disableBody(true, true);
      this.definition = null;
      this.movementState = null;
      this.ageSeconds = 0;
      this.maxHealth = 0;
      this.health = 0;
    }
  }
}
