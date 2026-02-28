import Phaser from 'phaser';
import { BossShip } from '../objects/BossShip';
import { PlayerShip } from '../objects/PlayerShip';
import { PowerupPickup } from '../objects/PowerupPickup';
import { LevelStats } from '../stats/LevelStats';
import { PowerupDropDirector } from './PowerupDropDirector';
import { ScoreDirector } from './ScoreDirector';

export class CollisionSystem {
  private stats = {
    enemiesDestroyed: 0,
    bossesDefeated: 0,
    hitsTaken: 0
  };

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly player: PlayerShip,
    private readonly scoreDirector: ScoreDirector,
    bullets: Phaser.Physics.Arcade.Group,
    enemies: Phaser.Physics.Arcade.Group,
    bosses: Phaser.Physics.Arcade.Group,
    powerups: Phaser.Physics.Arcade.Group,
    powerupDropDirector: PowerupDropDirector
  ) {
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
        this.scoreDirector.onEnemyKilled('wave', false);
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
          this.scoreDirector.onEnemyKilled('boss', true);
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
    return {
      score: this.scoreDirector.getScore(),
      enemiesDestroyed: this.stats.enemiesDestroyed,
      bossesDefeated: this.stats.bossesDefeated,
      hitsTaken: this.stats.hitsTaken,
      maxMultiplier: this.scoreDirector.getMaxMultiplier(),
      maxChainCount: this.scoreDirector.getMaxChainCount()
    };
  }

  private onPlayerHit() {
    this.stats.hitsTaken += 1;
    this.scoreDirector.onPlayerHit();
    this.scene.cameras.main.shake(200, 0.01);
    this.player.setTint(0xff55ff);
    this.scene.time.delayedCall(120, () => {
      this.player.clearTint();
    });
  }
}
