/*global Phaser*/
import * as ChangeScene from './ChangeScene.js';
export default class GameWinScene extends Phaser.Scene {
  constructor () {
    super('GameWinScene');
  }

  init (data) {
    // Initialization code goes here
    this.total_count = data.total_count;
    this.enemy_total = data.enemy_total;
  }

  preload () {
    // Preload assets
    this.load.image('win', './assets/UI/win.png');
    this.load.image('star1', './assets/UI/star1.png');
    this.load.image('star2', './assets/UI/star2.png');
    this.load.image('star3', './assets/UI/star3.png');

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  create (data) {
    //Add event listeners
    ChangeScene.addSceneEventListeners(this);

    //Create the scene and add text
    var logo = this.add.image(this.centerX, this.centerY, 'win');
    var text = this.add.text(this.centerX-400, this.centerY+300, "Press 0 to main menu", {fontSize:60})

    if (this.total_count >= 0.9* this.enemy_total){
      this.add.image(this.centerX, this.centerY+150, 'star3').setScale(0.7)
    } else if (this.total_count >= 0.7* this.enemy_total){
      this.add.image(this.centerX, this.centerY+150, 'star2').setScale(0.7)
    } else{
      this.add.image(this.centerX, this.centerY+150, 'star1').setScale(0.7)
    }
  }

  update (time, delta) {
    // Update the scene
  }
}
