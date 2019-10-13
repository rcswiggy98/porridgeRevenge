/*global Phaser*/
import * as ChangeScene from './ChangeScene.js';
export default class GameOverScene extends Phaser.Scene {
  constructor () {
    super('GameOverScene');
  }

  init (data) {
    // Initialization code goes here
    this.score = data.score;
  }

  preload () {
    // Preload assets
    this.load.image('gameOver', './assets/UI/gameOver.png');


    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  create (data) {
    //Add event listeners
    ChangeScene.addSceneEventListeners(this);

    //Create the scene and add text
    var logo = this.add.image(this.centerX, this.centerY, 'gameOver');
    var text = this.add.text(this.centerX-400, this.centerY+300, "Press 0 to main menu", {fontSize:60})

  }

  update (time, delta) {
    // Update the scene
  }
}
