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
    this.load.spritesheet("rice", "./assets/enemy/rice.png", {
      frameHeight: 233,
      frameWidth: 103
    });

    this.load.image('board', "./assets/background/board.png");
    this.load.image('pot', "./assets/background/pot.png");
    this.load.image('stove', "./assets/background/stove.png");
    this.load.image('faucet', "./assets/player/faucet.png");
    this.load.image('water_bullet', "./assets/player/waterdrop.png");

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  create (data) {
    //Add event listeners
    ChangeScene.addSceneEventListeners(this);

    //set world boundary
    this.physics.world.setBounds(0, 900, 1920, 210);

    // add background
    const pot = this.add.sprite(1920 / 2, 300 , 'pot').setScale(0.8).setDepth(1);
    const stove = this.add.sprite(1920 / 2, 375 , 'stove');
    const board = this.add.sprite(1920 / 2, 900 , 'board');

    // add faucet
    this.faucet = this.physics.add.sprite(1920/2, 1080, 'faucet');
    this.faucet.setScale(0.5);
    this.faucet_lftime = 0.0; // last time faucet fired water mod 5000

    // add group for faucet water bullets
    this.water_bullets = this.physics.add.group({
      defaultKey: "water_bullet",
      maxSize: 30
    });

    // add multiple enemies
    this.enemyGroup = this.physics.add.group({
      key: "rice",
      repeat: 4,
      setXY: {
        x: 30,
        y: 650,
        stepY:90
      }
    });
    // Create multiple stars
    this.enemyGroup.children.iterate(function(child) {
      child.setScale(0.5);
      //child.setCollideWorldBounds(true);
    });

    // add animations to enemy
    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers("rice", { start: 0, end: 0 }),
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
    // add cursor keys
    var cursors = this.input.keyboard.createCursorKeys();

    // faucet speed
    var faucet_speed = 8;
    // set speed of enemy and assign events
    var speed = 2;
    // firing rate for faucet in miliseconds
    var frate_faucet = 300;

    // collision for water bullets
    this.water_bullets.children.each(
      function (b) {
        if (b.active) {
          this.physics.add.overlap(
            b,
            this.enemyGroup,
            this.hit_enemy,
            null,
            this
          );
          if (b.y < 0) {
            b.destroy(); // destroy the bullets so they don't remain in memory
          } else if (b.y > this.cameras.main.height) {
            b.destroy();
          } else if (b.x < 0) {
            b.destroy();
          } else if (b.x > this.cameras.main.width) {
            b.destroy();
          }
        }
      }.bind(this)
    );

    this.enemyGroup.children.iterate(child => {
      child.x += speed + Phaser.Math.Between(0,5);
      child.anims.play('walk', true)
    })

    // faucet controls
    if (cursors.left.isDown) {
      this.faucet.x -= faucet_speed;
    } else if (cursors.right.isDown) {
      this.faucet.x += faucet_speed;
    } 
    if (cursors.space.isDown) {
      // get the current timestamp mod 5000 
      var mod_time = Phaser.Math.Wrap(time, 0, 5000)
      // we only fire another shot if time > firing rate has elapsed
      // Phaser.Math.Difference(a,b) = absolute value of a-b
      if (Phaser.Math.Difference(mod_time,this.faucet_lftime) > frate_faucet) {
        this.faucet_lftime = mod_time
        this.shoot_water()
      }
    }
  }

  shoot_water() {
    var water_bullet = this.water_bullets.get();
    // ensure water_bullet is not null
    if (water_bullet) {
      water_bullet.setAngle(180);
      water_bullet
        .enableBody(true, this.faucet.x, this.faucet.y, true, true)
        .setVelocityY(-900)
        .setDepth(1);
    }
  }

  hit_enemy(projectile, enemy) {
    enemy.disableBody(true, true);
    projectile.disableBody(true, true);
  }

}
