import Phaser from 'phaser';
import { AutoFireSystem } from '../components/AutoFireSystem';
import { BossHealthBar } from '../components/BossHealthBar';
import { BossSpawner } from '../components/BossSpawner';
import { CollisionSystem } from '../components/CollisionSystem';
import { EnemySpawner } from '../components/EnemySpawner';
import { LevelDirector } from '../components/LevelDirector';
import { LevelProgressBar } from '../components/LevelProgressBar';
import { ShipSelectorUI } from '../components/ShipSelectorUI';
import { TouchController } from '../components/TouchController';
import { BossShip } from '../objects/BossShip';
import { EnemyShip } from '../objects/EnemyShip';
import { PlayerBullet } from '../objects/PlayerBullet';
import { PlayerShip } from '../objects/PlayerShip';
import { StarfieldLayer } from '../objects/StarfieldLayer';
import { getPlayfieldBounds } from '../layout/Playfield';
import { getDefaultLevel, getLevelById, LEVEL_REGISTRY } from '../levels/LevelRegistry';
import { LevelDefinition } from '../levels/LevelDefinition';
import { getDefaultShip, SHIP_REGISTRY } from '../ships/ShipRegistry';
import { ShipDefinition } from '../ships/ShipDefinition';
import { CGA_HEX, CGA_NUM } from '../style/CgaPalette';

export class GameScene extends Phaser.Scene {
  private selectedLevel!: LevelDefinition;
  private player!: PlayerShip;
  private gameplayActive = false;
  private levelExitStarted = false;

  private touchController!: TouchController;
  private autoFire!: AutoFireSystem;
  private enemySpawner!: EnemySpawner;
  private bossSpawner!: BossSpawner;
  private levelDirector!: LevelDirector;
  private levelProgressBar!: LevelProgressBar;
  private bossHealthBar!: BossHealthBar;
  private shipSelector!: ShipSelectorUI;
  private arenaFrame!: Phaser.GameObjects.Graphics;
  private menuButtonBg!: Phaser.GameObjects.Rectangle;
  private menuButtonIcon!: Phaser.GameObjects.Text;

  private starLayers: StarfieldLayer[] = [];

  constructor() {
    super('GameScene');
  }

  init(data: { levelId?: string }) {
    this.selectedLevel = data.levelId ? getLevelById(data.levelId) : getDefaultLevel();
  }

  create() {
    this.cameras.main.setBackgroundColor(CGA_HEX.black);
    this.arenaFrame = this.add.graphics().setDepth(80).setScrollFactor(0);
    this.levelProgressBar = new LevelProgressBar(this);
    this.bossHealthBar = new BossHealthBar(this);
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
      this.scale.height + 28,
      defaultShip.textureKey
    );

    this.touchController = new TouchController(this, this.player, ShipSelectorUI.reservedHeight);
    this.autoFire = new AutoFireSystem(this, this.player, defaultShip);
    this.enemySpawner = new EnemySpawner(this);
    this.bossSpawner = new BossSpawner(this);

    this.levelDirector = new LevelDirector(
      this,
      this.enemySpawner,
      this.bossSpawner,
      this.selectedLevel
    );

    new CollisionSystem(
      this,
      this.player,
      this.autoFire.getGroup(),
      this.enemySpawner.getGroup(),
      this.bossSpawner.getGroup()
    );

    this.shipSelector = new ShipSelectorUI(this, SHIP_REGISTRY, defaultShip.id, (ship) => {
      this.applyShip(ship);
    });

    this.createMenuButton();

    this.applyShip(defaultShip);
    this.levelProgressBar.update(this.levelDirector.getProgressRatio());
    this.bossHealthBar.update(this.bossSpawner.getVisibleBossHealthRatio());
    this.playLevelIntro();

    this.scale.on('resize', this.onResize, this);
    this.events.once('shutdown', this.shutdown, this);
  }

  update(_time: number, delta: number) {
    const deltaSeconds = delta / 1000;

    for (const layer of this.starLayers) {
      layer.update(deltaSeconds);
    }

    if (this.gameplayActive) {
      this.touchController.update(deltaSeconds);
      this.autoFire.update(deltaSeconds);
      this.levelDirector.update(deltaSeconds);
    }

    this.levelProgressBar.update(this.levelDirector.getProgressRatio());
    this.bossHealthBar.update(this.bossSpawner.getVisibleBossHealthRatio());

    if (this.gameplayActive && this.levelDirector.isLevelComplete() && !this.levelExitStarted) {
      this.playLevelExit();
    }
  }

  shutdown() {
    this.touchController.destroy();
    this.shipSelector.destroy();
    this.levelDirector.destroy();
    this.levelProgressBar.destroy();
    this.bossHealthBar.destroy();
    this.menuButtonBg.destroy();
    this.menuButtonIcon.destroy();
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
    this.player.y = Phaser.Math.Clamp(this.player.y, 12, gameSize.height - ShipSelectorUI.reservedHeight);

    this.shipSelector.layout(gameSize.width, gameSize.height);
    this.levelDirector.onResize(gameSize.width, gameSize.height);
    this.layoutMenuButton(gameSize.width, gameSize.height);

    const enemies = this.enemySpawner.getGroup();
    enemies.children.each((child) => {
      const enemy = child as EnemyShip;
      enemy.x = Phaser.Math.Clamp(enemy.x, bounds.left + 16, bounds.right - 16);
      return true;
    });

    const bosses = this.bossSpawner.getGroup();
    bosses.children.each((child) => {
      const boss = child as BossShip;
      boss.x = Phaser.Math.Clamp(boss.x, bounds.left + 28, bounds.right - 28);
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
    this.bossHealthBar.update(this.bossSpawner.getVisibleBossHealthRatio());
  }

  private playLevelIntro() {
    this.gameplayActive = false;
    this.levelExitStarted = false;

    // Bring ship from below the screen into center before gameplay starts.
    this.player.setPosition(this.scale.width * 0.5, this.scale.height + 28);
    this.tweens.add({
      targets: this.player,
      x: this.scale.width * 0.5,
      y: this.scale.height * 0.5,
      duration: 700,
      ease: 'Sine.easeOut',
      onComplete: () => {
        this.gameplayActive = true;
      }
    });
  }

  private playLevelExit() {
    this.gameplayActive = false;
    this.levelExitStarted = true;
    const nextLevelId = this.getNextLevelId();

    // Exit from current position upward, then route to next level or main menu.
    this.tweens.add({
      targets: this.player,
      y: -40,
      duration: 650,
      ease: 'Sine.easeIn',
      onComplete: () => {
        if (nextLevelId) {
          this.scene.start('GameScene', { levelId: nextLevelId });
        } else {
          this.scene.start('StartScene');
        }
      }
    });
  }

  private getNextLevelId(): string | null {
    const currentIndex = LEVEL_REGISTRY.findIndex((level) => level.id === this.selectedLevel.id);
    if (currentIndex < 0) {
      return null;
    }

    const nextLevel = LEVEL_REGISTRY[currentIndex + 1];
    return nextLevel ? nextLevel.id : null;
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

  private createMenuButton() {
    this.menuButtonBg = this.add
      .rectangle(0, 0, 18, 18, CGA_NUM.black, 1)
      .setStrokeStyle(1, CGA_NUM.cyan)
      .setDepth(130)
      .setScrollFactor(0)
      .setInteractive({ useHandCursor: true });

    // Use a hamburger icon to indicate menu while keeping footprint small.
    this.menuButtonIcon = this.add
      .text(0, 0, '≡', {
        fontFamily: 'Courier New, monospace',
        fontSize: '14px',
        color: CGA_HEX.white
      })
      .setOrigin(0.5)
      .setDepth(131)
      .setScrollFactor(0);

    this.menuButtonBg.on('pointerdown', () => {
      this.scene.start('StartScene');
    });

    this.layoutMenuButton(this.scale.width, this.scale.height);
  }

  private layoutMenuButton(width: number, height: number) {
    const bounds = getPlayfieldBounds(width, height);
    const buttonX = width - Math.max(10, Math.floor(bounds.sidePanelWidth * 0.45));
    const buttonHeight = this.menuButtonBg.height;
    const buttonY = 10 + buttonHeight * 0.5;

    this.menuButtonBg.setPosition(buttonX, buttonY);
    this.menuButtonIcon.setPosition(buttonX, buttonY - 1);
  }
}
