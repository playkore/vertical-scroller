import Phaser from 'phaser';
import { PlayerShip } from '../objects/PlayerShip';
import { PlayerBullet } from '../objects/PlayerBullet';

export class AutoFireSystem {
  private readonly bullets: Phaser.Physics.Arcade.Group;
  private fireCooldown = 0;

  constructor(private readonly scene: Phaser.Scene, private readonly player: PlayerShip) {
    this.bullets = this.scene.physics.add.group({
      classType: PlayerBullet,
      maxSize: 40,
      runChildUpdate: true
    });
  }

  update(deltaSeconds: number) {
    this.fireCooldown -= deltaSeconds;
    if (this.fireCooldown <= 0) {
      this.fireCooldown = 0.15;
      this.fire();
    }
  }

  getGroup(): Phaser.Physics.Arcade.Group {
    return this.bullets;
  }

  private fire() {
    const bullet = this.bullets.get(this.player.x, this.player.y - 12) as PlayerBullet | null;
    if (!bullet) {
      return;
    }

    bullet.fire(this.player.x, this.player.y - 12);
  }
}
