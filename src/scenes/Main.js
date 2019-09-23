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

    this.load.image('board', "./assets/background/board.png")
    this.load.image('pot', "./assets/background/pot.png")
    this.load.image('stove', "./assets/background/stove.png")

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  create (data) {
    //Add event listeners
    ChangeScene.addSceneEventListeners(this);

    //set world boundary
    //this.physics.world.setBounds(0, 900, 1920, 210);

    // add background
    const pot = this.add.sprite(1920 / 2, 300 , 'pot').setScale(0.7).setDepth(1);
    const stove = this.add.sprite(1920 / 2, 400 , 'stove');
    const board = this.add.sprite(1920 / 2, 900 , 'board');
    this.enemyGroup;

    // add enemy
    //this.enemy = this.physics.add.sprite(0, 200, 'alien').setDepth(1);
    //this.enemy.setCollideWorldBounds(true);

    // add multiple enemies
    this.enemyGroup = this.physics.add.group({
      key: "alien",
      repeat: 4,
      setXY: {
        x: 30,
        y: 650,
        stepY:90
      }
    });

    // Create multiple stars
    this.enemyGroup.children.iterate(function(child) {
      child.setScale(1);
      //child.setCollideWorldBounds(true);
    });

    // add animations to enemy
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

    // set speed of enemy and assign events
    var speed = 6;
/*
    this.enemyGroup[i].x += speed;
    this.enemyGroup[i].anims.play("walk", true);
    this.enmeyGroup[i].flipX = false;



/*
    if (this.enemy.x > 1900) {
      this.enemy.anims.play('idle', true);
    } else {
      this.enemy.x += speed;
      this.enemy.anims.play("walk", true);
      this.enmey.flipX = false;
    }
*/
  }
}
