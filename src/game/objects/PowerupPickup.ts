import Phaser from 'phaser';
import { PlayerShip } from './PlayerShip';
import { PowerupDefinition } from '../powerups/PowerupDefinition';

export class PowerupPickup extends Phaser.Physics.Arcade.Sprite {
  private definition: PowerupDefinition | null = null;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'powerup-signal-scrap');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setActive(false);
    this.setVisible(false);
  }

  spawn(definition: PowerupDefinition, x: number, y: number) {
    this.definition = definition;
    this.enableBody(true, x, y, true, true);
    this.setTexture(definition.textureKey);
    this.setVelocity(0, definition.fallSpeed);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(12, 12);
    body.setOffset(2, 2);
    body.updateFromGameObject();
  }

  collect(player: PlayerShip) {
    if (!this.definition) {
      return;
    }

    this.definition.behavior.onCollect({ scene: this.scene, player });
    this.disableBody(true, true);
    this.definition = null;
  }

  preUpdate(_time: number, _delta: number): void {
    if (!this.active || !this.definition) {
      return;
    }

    if (this.y > this.scene.scale.height + 20) {
      this.disableBody(true, true);
      this.definition = null;
    }
  }
}
