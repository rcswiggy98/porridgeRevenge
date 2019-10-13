/*global Phaser*/
import * as ChangeScene from './ChangeScene.js';
export default class ChooseLevelScene extends Phaser.Scene {
  constructor () {
    super('ChooseLevel');
  }

  init (data) {
    // Initialization code goes here
  }

  preload () {
    // Preload assets
    this.load.image('level', './assets/UI/level.png');
    this.load.image('soup1', './assets/UI/soup1.png');
    this.load.image('soup2', './assets/UI/soup2.png');

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;

    // 1.1 load sounds in both formats mp3 and ogg
    this.load.audio("background", ["assets/sounds/background.mp3"]);
  }

  create (data) {
    //Add event listeners
    ChangeScene.addSceneEventListeners(this);

    //Create the scene and add text
    var background = this.add.image(this.centerX, this.centerY, 'level');


    }

  update (time, delta) {
    // Update the scene
  }
}
