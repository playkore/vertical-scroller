import Phaser from 'phaser';
import { BossShip } from '../objects/BossShip';
import { getPlayfieldBounds } from '../layout/Playfield';
import { PlayerShip } from '../objects/PlayerShip';
import { PowerupPickup } from '../objects/PowerupPickup';
import { LevelStats } from '../stats/LevelStats';
import { PowerupDropDirector } from './PowerupDropDirector';

export class CollisionSystem {
  private stats: LevelStats = {
    score: 0,
    enemiesDestroyed: 0,
    bossesDefeated: 0,
    hitsTaken: 0
  };

  private readonly scoreText: Phaser.GameObjects.Text;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly player: PlayerShip,
    bullets: Phaser.Physics.Arcade.Group,
    enemies: Phaser.Physics.Arcade.Group,
    bosses: Phaser.Physics.Arcade.Group,
    powerups: Phaser.Physics.Arcade.Group,
    powerupDropDirector: PowerupDropDirector
  ) {
    const bounds = getPlayfieldBounds(this.scene.scale.width, this.scene.scale.height);

    this.scoreText = this.scene.add
      .text(bounds.left + 10, 10, 'SCORE 00000', {
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
        const dropX = enemy.x;
        const dropY = enemy.y;

        bullet.disableBody(true, true);
        enemy.disableBody(true, true);
        powerupDropDirector.onEnemyDestroyed(dropX, dropY);
        this.stats.enemiesDestroyed += 1;
        this.addScore(10);
      },
      undefined,
      this
    );

    this.scene.physics.add.overlap(
      bullets,
      bosses,
      (bulletObj, bossObj) => {
        const bullet = bulletObj as Phaser.Physics.Arcade.Image;
        const boss = bossObj as BossShip;

        bullet.disableBody(true, true);
        const defeated = boss.takeHit(1);
        if (defeated) {
          this.stats.bossesDefeated += 1;
          this.addScore(500);
        }
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

    this.scene.physics.add.overlap(
      this.player,
      bosses,
      () => {
        this.onPlayerHit();
      },
      undefined,
      this
    );

    this.scene.physics.add.overlap(
      this.player,
      powerups,
      (playerObj, powerupObj) => {
        const player = playerObj as PlayerShip;
        const powerup = powerupObj as PowerupPickup;
        powerup.collect(player);
      },
      undefined,
      this
    );
  }

  getStatsSnapshot(): LevelStats {
    return { ...this.stats };
  }

  private addScore(points: number) {
    this.stats.score += points;
    this.scoreText.setText(`SCORE ${this.stats.score.toString().padStart(5, '0')}`);
  }

  private onPlayerHit() {
    this.stats.hitsTaken += 1;
    this.scene.cameras.main.shake(200, 0.01);
    this.player.setTint(0xff55ff);
    this.scene.time.delayedCall(120, () => {
      this.player.clearTint();
    });
  }
}
