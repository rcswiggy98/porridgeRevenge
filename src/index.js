/*global Phaser, window*/
import Level1 from './scenes/Level1.js';
import Level2 from './scenes/Level2.js';
import Boot from './scenes/Boot.js'
import GameWinScene from './scenes/GameWinScene.js'
import GameOverScene from './scenes/GameOverScene.js'

import Config from './config/config.js';

class Game extends Phaser.Game {
  constructor () {
    super(Config);
    this.scene.add('Level1', Level1);
    this.scene.add('Level2', Level2);
    this.scene.add('Boot', Boot);
    this.scene.add('GameOverScene', GameOverScene);
    this.scene.add('GameWinScene', GameWinScene);
    this.scene.start('Boot');
  }
}

window.game = new Game();
