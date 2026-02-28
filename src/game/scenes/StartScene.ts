import Phaser from 'phaser';
import { MenuButton } from '../components/MenuButton';
import { getDefaultLevel } from '../levels/LevelRegistry';
import { CGA_HEX } from '../style/CgaPalette';
import {
  getContinueBehavior,
  getContinueTargetLevelId
} from '../stats/Progression';

export class StartScene extends Phaser.Scene {
  private continueButton!: MenuButton;
  private newGameButton!: MenuButton;
  private levelsButton!: MenuButton;
  private enemiesButton!: MenuButton;

  constructor() {
    super('StartScene');
  }

  create() {
    this.cameras.main.setBackgroundColor(CGA_HEX.black);

    this.add
      .text(this.scale.width * 0.5, this.scale.height * 0.24, 'VERTICAL SCROLLER', {
        fontFamily: 'Courier New, monospace',
        fontSize: '22px',
        color: CGA_HEX.cyan
      })
      .setOrigin(0.5)
      .setDepth(120);

    this.add
      .text(this.scale.width * 0.5, this.scale.height * 0.3, 'CGA EDITION', {
        fontFamily: 'Courier New, monospace',
        fontSize: '14px',
        color: CGA_HEX.magenta
      })
      .setOrigin(0.5)
      .setDepth(120);

    const defaultLevel = getDefaultLevel();
    const continueLevelId = getContinueTargetLevelId();
    const continueBehavior = getContinueBehavior();

    this.continueButton = new MenuButton(this, {
      label: 'CONTINUE',
      x: this.scale.width * 0.5,
      y: this.scale.height * 0.52,
      width: 180,
      height: 38,
      enabled: Boolean(continueLevelId),
      onClick: () => {
        if (!continueLevelId) {
          return;
        }

        if (continueBehavior === 'open-level-select') {
          this.scene.start('LevelSelectScene', { focusedLevelId: continueLevelId });
          return;
        }

        this.scene.start('GameScene', { levelId: continueLevelId });
      }
    });

    this.newGameButton = new MenuButton(this, {
      label: 'NEW GAME',
      x: this.scale.width * 0.5,
      y: this.scale.height * 0.6,
      width: 180,
      height: 38,
      enabled: true,
      onClick: () => {
        this.scene.start('GameScene', {
          levelId: defaultLevel.id
        });
      }
    });

    this.levelsButton = new MenuButton(this, {
      label: 'LEVELS',
      x: this.scale.width * 0.5,
      y: this.scale.height * 0.67,
      width: 180,
      height: 38,
      enabled: true,
      onClick: () => {
        this.scene.start('LevelSelectScene');
      }
    });

    this.enemiesButton = new MenuButton(this, {
      label: 'ENEMIES',
      x: this.scale.width * 0.5,
      y: this.scale.height * 0.75,
      width: 180,
      height: 38,
      enabled: true,
      onClick: () => {
        this.scene.start('EnemiesScene');
      }
    });

    this.scale.on('resize', this.onResize, this);
    this.events.once('shutdown', this.shutdown, this);
  }

  private onResize(gameSize: Phaser.Structs.Size) {
    const centerX = gameSize.width * 0.5;

    this.continueButton.setPosition(centerX, gameSize.height * 0.52);
    this.newGameButton.setPosition(centerX, gameSize.height * 0.6);
    this.levelsButton.setPosition(centerX, gameSize.height * 0.67);
    this.enemiesButton.setPosition(centerX, gameSize.height * 0.75);
  }

  private shutdown() {
    this.continueButton.destroy();
    this.newGameButton.destroy();
    this.levelsButton.destroy();
    this.enemiesButton.destroy();
    this.scale.off('resize', this.onResize, this);
  }
}
