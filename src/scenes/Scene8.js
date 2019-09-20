/*global Phaser*/
import * as ChangeScene from './ChangeScene.js';
export default class BootScene extends Phaser.Scene {
  constructor () {
    super('Scene8');
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
    //Create the scene
    //var logo = this.add.image(this.centerX, this.centerY, 'logo');
    var text = this.add.text(this.centerX - 20, this.centerY, 'Scene8');
    ChangeScene.addSceneEventListeners(this);
  }

  update (time, delta) {
    // Update the scene
  }
}
