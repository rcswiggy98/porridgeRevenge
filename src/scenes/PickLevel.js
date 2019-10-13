/*global Phaser*/
import * as ChangeScene from './ChangeScene.js';
export default class PickLevel extends Phaser.Scene {
  constructor () {
    super('PickLevel');
  }

  init (data) {
    // Initialization code goes here
  }

  preload () {
    // Preload assets
    this.load.image('pick', './assets/UI/level.png');
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
    var background = this.add.image(this.centerX, this.centerY, 'pick');
    var level1 = this.add.image(this.centerX-300, this.centerY+200, 'soup1').setScale(0.75).setInteractive();
    level1.on("pointerup",function(){
      this.scene.start("Level1");
    }, this
  );
    var level2 = this.add.image(this.centerX+300, this.centerY+200, 'soup2').setScale(0.75).setInteractive();
    level2.on("pointerup",function(){
      this.scene.start("Level2");
    }, this
  );
  }

  update (time, delta) {
    // Update the scene
  }
}
