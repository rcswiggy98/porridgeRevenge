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
    this.load.image('knife', "./assets/player/knife.png");

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

    // add knife
    this.knife = this.physics.add.sprite(1920/2, 1080/2, 'knife')
    this.knife.setScale(0.5);
    //this.knife_chopping = false;
    this.knife.setOrigin(0.9, 0.75)

    // knife chop tween
    this.tw = this.tweens.add({
      targets: this.knife,
      angle: { from: 0, to: 90 },
      ease: 'Linear',
      duration: 100,
      repeat: 2,
      yoyo: true
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
    var keys = this.input.keyboard.createCursorKeys();

    // enable 'WASD, space' to control faucet
    var keys = this.input.keyboard.addKeys({
      up: 'W',
      down: 'S',
      left: 'A',
      right: 'D',
      space: 'SPACE'
    });  

    // touch/mouse listening
    var pointer = this.input.activePointer;
  
    // faucet speed
    var faucet_speed = 8;
    // set speed of enemy and assign events
    var speed = 2;
    // firing rate for faucet in miliseconds
    var frate_faucet = 300;

    // collision for water bullets
    this.set_proj_collision(this.water_bullets, this.enemyGroup)

    this.enemyGroup.children.iterate(child => {
      child.setInteractive().on(
        'pointerdown', 
        function (pointer, localX, localY, event) {
          child.destroy()
        }
      )
      child.x += speed + Phaser.Math.Between(0,5);
      child.anims.play('walk', true)
    })

    // faucet controls
    if (keys.left.isDown) {
      this.faucet.x -= faucet_speed;
    } else if (keys.right.isDown) {
      this.faucet.x += faucet_speed;
    } 
    if (keys.space.isDown) {
      // get the current timestamp mod 5000 
      var mod_time = Phaser.Math.Wrap(time, 0, 5000)
      // we only fire another shot if time > firing rate has elapsed
      // Phaser.Math.Difference(a,b) = absolute value of a-b
      if (Phaser.Math.Difference(mod_time,this.faucet_lftime) > frate_faucet) {
        this.faucet_lftime = mod_time
        this.shoot_water()
      }
    }

    // knife controls
    var X = pointer.worldX;
    var Y = pointer.worldY;
    this.knife.x = X
    this.knife.y = Y
    if (pointer.isDown && ~this.tw.isPlaying()) {
      this.tw.play();
      this.knife_attack(X, Y)
    } 
    /** 
    if (pointer.isUp) {
      // follow mouse if user is not clicking AND knife is currently chopping
      this.knife.setXY(X, Y)
    } else if (pointer.isDown && ~(this.knife_chopping)) {
      // chop if mouse clicked
      this.knife_chopping = true;
      this.knife_attack(X, Y)
    } else if (pointer.isDown && this.knife_chopping) {
      // continue the motion of the knife
      this.knife_attack(X,Y)
    }
    */
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

  knife_attack(x, y) {
    // kill the rice

  }

  hit_enemy(projectile, enemy) {
    enemy.disableBody(true, true);
    projectile.disableBody(true, true);
  }

  // general function to handle families of projectiles and collisions
  set_proj_collision (proj_group, enemies) {
    proj_group.children.each(
      function (p) {
        if (p.active) {
          this.physics.add.overlap(
            p,
            this.enemies,
            this.hit_enemy,
            null,
            this
          );
          if (p.y < 0) {
            p.destroy(); 
          } else if (p.y > this.cameras.main.height) {
            p.destroy();
          } else if (p.x < 0) {
            p.destroy();
          } else if (p.x > this.cameras.main.width) {
            p.destroy();
          }
        }
      }.bind(this)
    );
  }

}
