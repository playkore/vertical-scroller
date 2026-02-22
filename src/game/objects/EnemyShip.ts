import Phaser from 'phaser';
import { getPlayfieldBounds } from '../layout/Playfield';
import { EnemyDefinition } from '../enemies/EnemyDefinition';

export class EnemyShip extends Phaser.Physics.Arcade.Sprite {
  private definition: EnemyDefinition | null = null;
  private movementState: unknown = null;
  private ageSeconds = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'enemy-raider');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setActive(false);
    this.setVisible(false);
  }

  spawn(definition: EnemyDefinition, x: number, y: number, initialSpeed: number) {
    this.definition = definition;
    this.ageSeconds = 0;

    this.enableBody(true, x, y, true, true);
    this.setTexture(definition.textureKey);
    this.setVelocity(0, 0);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(definition.collider.width, definition.collider.height);
    body.setOffset(definition.collider.offsetX, definition.collider.offsetY);

    const bounds = getPlayfieldBounds(this.scene.scale.width, this.scene.scale.height);
    this.movementState = definition.movement.onSpawn?.({
      enemy: this,
      scene: this.scene,
      spawnX: x,
      spawnY: y,
      initialSpeed,
      playfieldLeft: bounds.left,
      playfieldRight: bounds.right
    });

    body.updateFromGameObject();
  }

  preUpdate(_time: number, delta: number): void {
    if (!this.active || !this.definition) {
      return;
    }

    const dt = delta / 1000;
    this.ageSeconds += dt;

    const bounds = getPlayfieldBounds(this.scene.scale.width, this.scene.scale.height);

    this.definition.movement.onUpdate?.({
      enemy: this,
      scene: this.scene,
      deltaSeconds: dt,
      ageSeconds: this.ageSeconds,
      state: this.movementState,
      playfieldLeft: bounds.left,
      playfieldRight: bounds.right
    });

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.updateFromGameObject();

    if (this.y > this.scene.scale.height + 20 || this.x < bounds.left - 24 || this.x > bounds.right + 24) {
      this.disableBody(true, true);
      this.definition = null;
      this.movementState = null;
      this.ageSeconds = 0;
    }
  }
}
