import Phaser from 'phaser';
import './styles/app.css';
import { BootScene } from './game/scenes/BootScene';
import { GameScene } from './game/scenes/GameScene';

const GAME_WIDTH = 360;
const GAME_HEIGHT = 640;

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'app',
  backgroundColor: '#000000',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAME_WIDTH,
    height: GAME_HEIGHT
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },
  scene: [BootScene, GameScene]
};

new Phaser.Game(config);
