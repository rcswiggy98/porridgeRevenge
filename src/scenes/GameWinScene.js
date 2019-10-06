/*global Phaser*/
import * as ChangeScene from './ChangeScene.js';
export default class GameWinScene extends Phaser.Scene {
  constructor () {
    super('GameWinScene');
  }

  init (data) {
    // Initialization code goes here
    this.score = data.score;
  }

  preload () {
    // Preload assets
    this.load.image('win', './assets/UI/win.png');

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  create (data) {
    //Add event listeners
    ChangeScene.addSceneEventListeners(this);

    //Create the scene and add text
    var logo = this.add.image(this.centerX, this.centerY, 'win');
    var text = this.add.text(this.centerX-200, this.centerY +220, 'Your Score is: ' + this.score,{ fontSize: '32px' });

    }

  update (time, delta) {
    // Update the scene
  }
}
