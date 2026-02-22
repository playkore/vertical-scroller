import Phaser from 'phaser';
import { AutoFireSystem } from '../components/AutoFireSystem';
import { CollisionSystem } from '../components/CollisionSystem';
import { EnemySpawner } from '../components/EnemySpawner';
import { TouchController } from '../components/TouchController';
import { EnemyShip } from '../objects/EnemyShip';
import { PlayerBullet } from '../objects/PlayerBullet';
import { PlayerShip } from '../objects/PlayerShip';
import { StarfieldLayer } from '../objects/StarfieldLayer';

export class GameScene extends Phaser.Scene {
  private player!: PlayerShip;

  private touchController!: TouchController;
  private autoFire!: AutoFireSystem;
  private enemySpawner!: EnemySpawner;

  private starLayers: StarfieldLayer[] = [];

  constructor() {
    super('GameScene');
  }

  create() {
    this.cameras.main.setBackgroundColor('#000000');

    this.starLayers = [
      new StarfieldLayer(this, {
        texture: 'star-small',
        count: 80,
        minSpeed: 15,
        maxSpeed: 30
      }),
      new StarfieldLayer(this, {
        texture: 'star-medium',
        count: 40,
        minSpeed: 35,
        maxSpeed: 65
      }),
      new StarfieldLayer(this, {
        texture: 'star-large',
        count: 18,
        minSpeed: 80,
        maxSpeed: 130
      })
    ];

    this.player = new PlayerShip(this, this.scale.width * 0.5, this.scale.height * 0.8);

    this.touchController = new TouchController(this, this.player);
    this.autoFire = new AutoFireSystem(this, this.player);
    this.enemySpawner = new EnemySpawner(this);

    new CollisionSystem(this, this.player, this.autoFire.getGroup(), this.enemySpawner.getGroup());

    this.scale.on('resize', this.onResize, this);
    this.events.once('shutdown', this.shutdown, this);
  }

  update(_time: number, delta: number) {
    const deltaSeconds = delta / 1000;

    for (const layer of this.starLayers) {
      layer.update(deltaSeconds);
    }

    this.touchController.update(deltaSeconds);
    this.autoFire.update(deltaSeconds);
    this.enemySpawner.update(deltaSeconds);
  }

  shutdown() {
    this.touchController.destroy();
    this.scale.off('resize', this.onResize, this);
  }

  private onResize(gameSize: Phaser.Structs.Size) {
    this.player.x = Phaser.Math.Clamp(this.player.x, 16, gameSize.width - 16);
    this.player.y = Phaser.Math.Clamp(this.player.y, gameSize.height * 0.45, gameSize.height - 20);

    const enemies = this.enemySpawner.getGroup();
    enemies.children.each((child) => {
      const enemy = child as EnemyShip;
      enemy.x = Phaser.Math.Clamp(enemy.x, 16, gameSize.width - 16);
      return true;
    });

    const bullets = this.autoFire.getGroup();
    bullets.children.each((child) => {
      const bullet = child as PlayerBullet;
      bullet.x = Phaser.Math.Clamp(bullet.x, 4, gameSize.width - 4);
      return true;
    });
  }
}
