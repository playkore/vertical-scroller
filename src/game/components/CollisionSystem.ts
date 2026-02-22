import Phaser from 'phaser';
import { PlayerShip } from '../objects/PlayerShip';

export class CollisionSystem {
  private score = 0;
  private readonly scoreText: Phaser.GameObjects.Text;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly player: PlayerShip,
    bullets: Phaser.Physics.Arcade.Group,
    enemies: Phaser.Physics.Arcade.Group
  ) {
    this.scoreText = this.scene.add
      .text(10, 10, 'SCORE 00000', {
        fontFamily: 'Courier New, monospace',
        fontSize: '14px',
        color: '#ffffff'
      })
      .setDepth(100)
      .setScrollFactor(0);

    this.scene.physics.add.overlap(
      bullets,
      enemies,
      (bulletObj, enemyObj) => {
        const bullet = bulletObj as Phaser.Physics.Arcade.Image;
        const enemy = enemyObj as Phaser.Physics.Arcade.Sprite;

        bullet.disableBody(true, true);
        enemy.disableBody(true, true);
        this.addScore(10);
      },
      undefined,
      this
    );

    this.scene.physics.add.overlap(
      this.player,
      enemies,
      (_playerObj, enemyObj) => {
        const enemy = enemyObj as Phaser.Physics.Arcade.Sprite;
        enemy.disableBody(true, true);
        this.onPlayerHit();
      },
      undefined,
      this
    );
  }

  private addScore(points: number) {
    this.score += points;
    this.scoreText.setText(`SCORE ${this.score.toString().padStart(5, '0')}`);
  }

  private onPlayerHit() {
    this.scene.cameras.main.shake(200, 0.01);
    this.player.setTint(0xff55ff);
    this.scene.time.delayedCall(120, () => {
      this.player.clearTint();
    });
  }
}
