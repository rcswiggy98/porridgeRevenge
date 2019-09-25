/*global Phaser*/
import * as ChangeScene from './ChangeScene.js';
export default class BootScene extends Phaser.Scene {
  constructor () {
    super('Boot');
  }

  init (data) {
    // Initialization code goes here
  }

  preload () {
    // Preload assets
    this.load.image('logo', './assets/logo.png');

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  create (data) {
    //Add event listeners
    ChangeScene.addSceneEventListeners(this);

    //Create the scene and add text
    var logo = this.add.image(this.centerX, this.centerY, 'logo');
<<<<<<< HEAD
    }
=======
    var text = this.add.text(this.centerX - 20, this.centerY, 'Press 0 to start the game.');
  }
>>>>>>> 2132b640b08dd59204ca8e48921946e73c47b3ff

  update (time, delta) {
    // Update the scene
  }
}
