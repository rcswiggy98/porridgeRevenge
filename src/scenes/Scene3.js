/*global Phaser*/
import * as ChangeScene from './ChangeScene.js';
export default class BootScene extends Phaser.Scene {
  constructor () {
    super('Scene3');
  }
  
  init (data) {
    // Initialization code goes here
  }

  preload () {
    // Preload assets
    this.load.spritesheet('buttons', './assets/spriteSheets/buttons.png', {
      frameHeight: 100,
      frameWidth: 200
    });

    this.load.audio('pops', './assets/sounds/buttonPops.mp3');

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  create (data) {
    //Create the scene
    ChangeScene.addSceneEventListeners(this);

    //Create the scene
    var sound = this.sound.add('pops');
    sound.addMarker({
      name: 'low',
      start: 0.15,
      duration: 0.5
    });
    sound.addMarker({
      name: 'high',
      start: 1.1,
      duration: 1.5
    });

  }

  update (time, delta) {
    // Update the scene
  }
}
