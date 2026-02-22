import Phaser from 'phaser';
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
    const x = Phaser.Math.Between(16, this.scene.scale.width - 16);
    const y = -18;
    const speed = Phaser.Math.Between(70, 140);

    const enemy = this.enemies.get(x, y) as EnemyShip | null;
    if (!enemy) {
      return;
    }

    enemy.spawn(x, y, speed);
  }
}
