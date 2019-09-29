/*global Phaser, window*/
import Main from './scenes/Main.js';
import Boot from './scenes/Boot.js'
import GameOverScene from './scenes/GameOverScene.js'

import Config from './config/config.js';

class Game extends Phaser.Game {
  constructor () {
    super(Config);
    this.scene.add('Main', Main);
    this.scene.add('Boot', Boot);
    this.scene.add('GameOverScene', GameOverScene);
    this.scene.start('Boot');
  }
}

window.game = new Game();
