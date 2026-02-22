import Phaser from 'phaser';
import { getPlayfieldBounds } from '../layout/Playfield';
import { EnemyDefinition } from '../enemies/EnemyDefinition';
import { EnemyShip } from '../objects/EnemyShip';

export class EnemySpawner {
  private readonly enemies: Phaser.Physics.Arcade.Group;

  constructor(private readonly scene: Phaser.Scene) {
    this.enemies = this.scene.physics.add.group({
      classType: EnemyShip,
      maxSize: 32,
      runChildUpdate: true
    });
  }

  getGroup(): Phaser.Physics.Arcade.Group {
    return this.enemies;
  }

  spawnEnemy(definition: EnemyDefinition) {
    const bounds = getPlayfieldBounds(this.scene.scale.width, this.scene.scale.height);
    const x = Phaser.Math.Between(
      bounds.left + definition.spawn.xPadding,
      bounds.right - definition.spawn.xPadding
    );
    const y = -18;
    const speed = Phaser.Math.Between(definition.spawn.minSpeed, definition.spawn.maxSpeed);

    const enemy = this.enemies.get(x, y) as EnemyShip | null;
    if (!enemy) {
      return;
    }

    enemy.spawn(definition, x, y, speed);
  }
}
