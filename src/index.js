/*global Phaser, window*/
import LevelT from './scenes/LevelT.js';
import Level1 from './scenes/Level1.js';
import Level2 from './scenes/Level2.js';
import Pause1 from './scenes/Pause1.js';
import Pause2 from './scenes/Pause2.js';
import Pause4 from './scenes/Pause4.js';
import Credit from './scenes/Credit.js';
import Level4 from './scenes/Level4.js';
import PickLevel from './scenes/PickLevel.js';
import Boot from './scenes/Boot.js'
import GameWinScene from './scenes/GameWinScene.js'
import GameOverScene from './scenes/GameOverScene.js'

import Config from './config/config.js';

class Game extends Phaser.Game {
  constructor () {
    super(Config);
    this.scene.add('LevelT', LevelT);
    this.scene.add('Level1', Level1);
    this.scene.add('Level2', Level2);
    this.scene.add('Pause1', Pause1);
    this.scene.add('Pause2', Pause2);
    this.scene.add('Pause4', Pause4);
    this.scene.add('Credit', Credit);
    this.scene.add('Level4', Level4);
    this.scene.add('PickLevel', PickLevel);
    this.scene.add('Boot', Boot);
    this.scene.add('GameOverScene', GameOverScene);
    this.scene.add('GameWinScene', GameWinScene);
    this.scene.start('Boot');
  }
}

window.game = new Game();
