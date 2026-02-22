import Phaser from 'phaser';
import { AutoFireSystem } from '../components/AutoFireSystem';
import { CollisionSystem } from '../components/CollisionSystem';
import { EnemySpawner } from '../components/EnemySpawner';
import { LevelDirector } from '../components/LevelDirector';
import { LevelProgressBar } from '../components/LevelProgressBar';
import { ShipSelectorUI } from '../components/ShipSelectorUI';
import { TouchController } from '../components/TouchController';
import { EnemyShip } from '../objects/EnemyShip';
import { PlayerBullet } from '../objects/PlayerBullet';
import { PlayerShip } from '../objects/PlayerShip';
import { StarfieldLayer } from '../objects/StarfieldLayer';
import { getPlayfieldBounds } from '../layout/Playfield';
import { getDefaultLevel } from '../levels/LevelRegistry';
import { getDefaultShip, SHIP_REGISTRY } from '../ships/ShipRegistry';
import { ShipDefinition } from '../ships/ShipDefinition';
import { CGA_HEX, CGA_NUM } from '../style/CgaPalette';

export class GameScene extends Phaser.Scene {
  private player!: PlayerShip;

  private touchController!: TouchController;
  private autoFire!: AutoFireSystem;
  private enemySpawner!: EnemySpawner;
  private levelDirector!: LevelDirector;
  private levelProgressBar!: LevelProgressBar;
  private shipSelector!: ShipSelectorUI;
  private arenaFrame!: Phaser.GameObjects.Graphics;

  private starLayers: StarfieldLayer[] = [];

  constructor() {
    super('GameScene');
  }

  create() {
    this.cameras.main.setBackgroundColor(CGA_HEX.black);
    this.arenaFrame = this.add.graphics().setDepth(80).setScrollFactor(0);
    this.levelProgressBar = new LevelProgressBar(this);
    this.drawArenaFrame();

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

    const defaultShip = getDefaultShip();

    this.player = new PlayerShip(
      this,
      this.scale.width * 0.5,
      this.scale.height * 0.78,
      defaultShip.textureKey
    );

    this.touchController = new TouchController(this, this.player, ShipSelectorUI.reservedHeight);
    this.autoFire = new AutoFireSystem(this, this.player, defaultShip);
    this.enemySpawner = new EnemySpawner(this);

    const defaultLevel = getDefaultLevel();
    this.levelDirector = new LevelDirector(this, this.enemySpawner, defaultLevel);

    new CollisionSystem(this, this.player, this.autoFire.getGroup(), this.enemySpawner.getGroup());

    this.shipSelector = new ShipSelectorUI(this, SHIP_REGISTRY, defaultShip.id, (ship) => {
      this.applyShip(ship);
    });

    this.applyShip(defaultShip);
    this.levelProgressBar.update(this.levelDirector.getProgressRatio());

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
    this.levelDirector.update(deltaSeconds);
    this.levelProgressBar.update(this.levelDirector.getProgressRatio());
  }

  shutdown() {
    this.touchController.destroy();
    this.shipSelector.destroy();
    this.levelDirector.destroy();
    this.levelProgressBar.destroy();
    this.arenaFrame.destroy();
    this.scale.off('resize', this.onResize, this);
  }

  private applyShip(ship: ShipDefinition) {
    this.player.setShipTexture(ship.textureKey);
    this.autoFire.setShip(ship);
  }

  private onResize(gameSize: Phaser.Structs.Size) {
    const bounds = getPlayfieldBounds(gameSize.width, gameSize.height);

    this.player.x = Phaser.Math.Clamp(this.player.x, bounds.left + 16, bounds.right - 16);
    this.player.y = Phaser.Math.Clamp(
      this.player.y,
      gameSize.height * 0.45,
      gameSize.height - ShipSelectorUI.reservedHeight
    );

    this.shipSelector.layout(gameSize.width, gameSize.height);
    this.levelDirector.onResize(gameSize.width, gameSize.height);

    const enemies = this.enemySpawner.getGroup();
    enemies.children.each((child) => {
      const enemy = child as EnemyShip;
      enemy.x = Phaser.Math.Clamp(enemy.x, bounds.left + 16, bounds.right - 16);
      return true;
    });

    const bullets = this.autoFire.getGroup();
    bullets.children.each((child) => {
      const bullet = child as PlayerBullet;
      bullet.x = Phaser.Math.Clamp(bullet.x, bounds.left + 4, bounds.right - 4);
      return true;
    });

    this.drawArenaFrame();
    this.levelProgressBar.update(this.levelDirector.getProgressRatio());
  }

  private drawArenaFrame() {
    const { width, height } = this.scale;
    const bounds = getPlayfieldBounds(width, height);

    this.arenaFrame.clear();

    this.arenaFrame.fillStyle(CGA_NUM.black, 1);
    this.arenaFrame.fillRect(0, 0, bounds.sidePanelWidth, height);
    this.arenaFrame.fillRect(bounds.right, 0, bounds.sidePanelWidth, height);

    this.arenaFrame.lineStyle(1, CGA_NUM.cyan, 1);
    this.arenaFrame.strokeRect(bounds.left, 0, bounds.width, height);
  }
}
