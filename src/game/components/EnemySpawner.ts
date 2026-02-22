import Phaser from 'phaser';
import { getPlayfieldBounds } from '../layout/Playfield';
import { EnemyShip } from '../objects/EnemyShip';

export class EnemySpawner {
  private readonly enemies: Phaser.Physics.Arcade.Group;
  private spawnCooldown = 0;

  constructor(private readonly scene: Phaser.Scene) {
    this.enemies = this.scene.physics.add.group({
      classType: EnemyShip,
      maxSize: 24,
      runChildUpdate: true
    });
  }

  update(deltaSeconds: number) {
    this.spawnCooldown -= deltaSeconds;
    if (this.spawnCooldown <= 0) {
      this.spawnCooldown = Phaser.Math.FloatBetween(0.5, 1.2);
      this.spawnEnemy();
    }
  }

  getGroup(): Phaser.Physics.Arcade.Group {
    return this.enemies;
  }

  private spawnEnemy() {
    const bounds = getPlayfieldBounds(this.scene.scale.width, this.scene.scale.height);
    const x = Phaser.Math.Between(bounds.left + 16, bounds.right - 16);
    const y = -18;
    const speed = Phaser.Math.Between(70, 140);

    const enemy = this.enemies.get(x, y) as EnemyShip | null;
    if (!enemy) {
      return;
    }

    enemy.spawn(x, y, speed);
  }
}
