/*global Phaser, window*/
import Level1 from './scenes/Level1.js';
import Level2 from './scenes/Level2.js';
import Level3 from './scenes/Level3.js';
import PickLevel from './scenes/PickLevel.js';
import Boot from './scenes/Boot.js'
import GameWinScene from './scenes/GameWinScene.js'
import GameOverScene from './scenes/GameOverScene.js'

import Config from './config/config.js';

class Game extends Phaser.Game {
  constructor () {
    super(Config);
    this.scene.add('Level1', Level1);
    this.scene.add('Level2', Level2);
    this.scene.add('Level3', Level3);
    this.scene.add('PickLevel', PickLevel);
    this.scene.add('Boot', Boot);
    this.scene.add('GameOverScene', GameOverScene);
    this.scene.add('GameWinScene', GameWinScene);
    this.scene.start('Level3');
  }
}

window.game = new Game();
