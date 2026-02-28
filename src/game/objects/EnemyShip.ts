import Phaser from 'phaser';
import { getPlayfieldBounds } from '../layout/Playfield';
import { resetVerticalLoopState } from '../enemies/EnemyBehaviorUtils';
import { EnemyDefinition } from '../enemies/EnemyDefinition';
import { CGA_NUM } from '../style/CgaPalette';

export class EnemyShip extends Phaser.Physics.Arcade.Sprite {
  private definition: EnemyDefinition | null = null;
  private movementState: unknown = null;
  private ageSeconds = 0;
  private maxHitPoints = 1;
  private hitPoints = 1;
  private readonly healthTrack: Phaser.GameObjects.Rectangle;
  private readonly healthFill: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'enemy-raider');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setActive(false);
    this.setVisible(false);

    this.healthTrack = scene.add
      .rectangle(0, 0, 16, 3, CGA_NUM.black, 1)
      .setOrigin(0.5)
      .setStrokeStyle(1, CGA_NUM.white)
      .setDepth(96)
      .setScrollFactor(0)
      .setVisible(false);

    this.healthFill = scene.add
      .rectangle(0, 0, 14, 1, CGA_NUM.cyan, 1)
      .setOrigin(0.5)
      .setDepth(97)
      .setScrollFactor(0)
      .setVisible(false);
  }

  spawn(definition: EnemyDefinition, x: number, y: number, initialSpeed: number) {
    this.definition = definition;
    this.ageSeconds = 0;
    this.maxHitPoints = Math.max(1, definition.maxHitPoints ?? 2);
    this.hitPoints = this.maxHitPoints;

    this.enableBody(true, x, y, true, true);
    this.setTexture(definition.textureKey);
    this.setVelocity(0, 0);
    resetVerticalLoopState(this);
    this.clearTint();
    this.hideHealthBar();

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

  takeHit(damage: number): boolean {
    if (!this.active || !this.definition) {
      return false;
    }

    this.hitPoints = Math.max(0, this.hitPoints - Math.max(1, damage));
    if (this.hitPoints <= 0) {
      this.despawn();
      return true;
    }

    this.refreshHealthBar();
    return false;
  }

  despawn() {
    this.disableBody(true, true);
    this.definition = null;
    this.movementState = null;
    this.ageSeconds = 0;
    this.maxHitPoints = 1;
    this.hitPoints = 1;
    this.hideHealthBar();
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
    this.refreshHealthBar();
  }

  destroy(fromScene?: boolean): void {
    this.healthTrack.destroy();
    this.healthFill.destroy();
    super.destroy(fromScene);
  }

  private refreshHealthBar() {
    const ratio = this.maxHitPoints > 0 ? this.hitPoints / this.maxHitPoints : 0;
    const showBar = this.active && this.definition !== null && ratio > 0 && ratio < 1;

    this.healthTrack.setVisible(showBar);
    this.healthFill.setVisible(showBar);
    if (!showBar) {
      return;
    }

    const barY = this.y - this.displayHeight * 0.5 - 5;
    this.healthTrack.setPosition(this.x, barY);

    const fillWidth = Math.max(1, Math.round(14 * ratio));
    this.healthFill.setSize(fillWidth, 1);
    this.healthFill.setDisplaySize(fillWidth, 1);
    this.healthFill.setPosition(this.x - 7 + fillWidth * 0.5, barY);
  }

  private hideHealthBar() {
    this.healthTrack.setVisible(false);
    this.healthFill.setVisible(false);
  }
}
