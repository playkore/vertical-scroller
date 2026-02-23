import Phaser from 'phaser';
import { PowerupPickup } from '../objects/PowerupPickup';
import { PowerupDefinition } from '../powerups/PowerupDefinition';

export class PowerupSpawner {
  private readonly powerups: Phaser.Physics.Arcade.Group;

  constructor(private readonly scene: Phaser.Scene) {
    this.powerups = this.scene.physics.add.group({
      classType: PowerupPickup,
      maxSize: 32,
      runChildUpdate: true
    });
  }

  getGroup(): Phaser.Physics.Arcade.Group {
    return this.powerups;
  }

  spawnPowerup(definition: PowerupDefinition, x: number, y: number) {
    const powerup = this.powerups.get(x, y) as PowerupPickup | null;
    if (!powerup) {
      return;
    }

    powerup.spawn(definition, x, y);
  }
}
