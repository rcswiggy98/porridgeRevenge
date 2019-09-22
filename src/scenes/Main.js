/*global Phaser*/
import * as ChangeScene from './ChangeScene.js';
export default class BootScene extends Phaser.Scene {
  constructor () {
    super('Main');
  }

  init (data) {
    // Initialization code goes here
  }

  preload () {
    // Preload assets
    this.load.spritesheet("alien", "./assets/spriteSheets/player.png", {
      frameHeight: 93,
      frameWidth: 67
    });

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  create (data) {
    //Add event listeners
    ChangeScene.addSceneEventListeners(this);

    // add player
    this.player = this.physics.add.sprite(0, 200, 'alien');
    //this.player.setCollideWorldBounds(true);

    // add animations to player
    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers("alien", { start: 0, end: 4 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("alien", { start: 0, end: 0 }),
      frameRate: 10,
      repeat: -1
    });
  }

  update (time, delta) {
    // Update the scene

    // set speed of player and assign events
    var speed = 6;

    this.player.x += speed;
    this.player.anims.play("walk", true);
    this.player.flipX = false;


/** 
    if (this.player.x > 1900) {
      this.player.anims.play('idle', true);
    } else {
      this.player.x += speed;
      this.player.anims.play("walk", true);
      this.player.flipX = false;
    }
*/
  }
}
