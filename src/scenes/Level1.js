/*global Phaser*/
import * as ChangeScene from './ChangeScene.js';

export default class Level1Scene extends Phaser.Scene {
  constructor () {
    super('Level1');
  }
  init (data) {
    // Initialization code goes here
  }

  preload () {
    // Preload assets
    this.load.spritesheet("rice", "./assets/enemy/riceS.png", {
      frameHeight: 233,
      frameWidth: 103
    });

    this.load.spritesheet("fire", "./assets/background/fire.png", {
      frameHeight: 235,
      frameWidth: 713
    });

    this.load.image('clickboard1', "./assets/background/clickboard.png");
    this.load.image('clickboard2', "./assets/background/clickboard.png");
    this.load.image('board', "./assets/background/board.png");
    this.load.image('pot', "./assets/background/pot.png");
    this.load.image('stove', "./assets/background/stove.png");
    this.load.image('faucet', "./assets/player/faucet.png");
    this.load.image('water_bullet', "./assets/player/waterdrop.png");
    // this.load.image('knife', "./assets/player/knife.png");
    this.load.image('rice_dead', "./assets/enemy/rice.png")

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;

    // 1.1 load sounds in both formats mp3 and ogg
    this.load.audio("background", ["assets/sounds/background.mp3"]);
    this.load.audio("chop", ["assets/sounds/chop.mp3"]);
    this.load.audio("water", ["assets/sounds/water.mp3"]);
  }

  create (data) {
    //Add event listeners
    ChangeScene.addSceneEventListeners(this);

    //set world boundary
    this.physics.world.setBounds(0, 0, 1920, 1080);

    // add background

    const stove = this.add.sprite(1920 / 2, 375 , 'stove');
    const board = this.add.sprite(1920 / 2, 900 , 'board');
    const clickboard1 = this.add.sprite(1920 / 6, 325 , 'clickboard1').setScale(1.1).setDepth(1);
    const clickboard2 = this.add.sprite(1920 * 5 / 6, 325 , 'clickboard2').setScale(1.1).setDepth(1);
    const pot = this.add.sprite(1920 / 2, 300 , 'pot').setScale(0.8).setDepth(1);
    this.fire = this.add.sprite(1920 / 2, 500, 'fire').setScale(0.8).setDepth(1);

    // add faucet
    this.faucet = this.physics.add.sprite(1920/2, 1080, 'faucet');
    this.faucet.setScale(0.5);
    this.faucet_lftime = 1.0; // last time faucet fired water mod 5000
    this.faucet.setCollideWorldBounds(true)
    this.score = 0;
    this.riceText = this.add.text(1400, 150, 'Rice Coming: ', { fontSize: '40px', fill: '#000000' }).setDepth(1);
    this.tText = this.add.text(105, 150, "Target Ingredients", { fontSize: '40px', fill: '#000000' }).setDepth(1);
    this.riceView = this.add.sprite(200, 300, 'rice_dead').setScale(0.7).setDepth(1);
    this.initialEnemy = 30;

    // create a array
    this.array = [{'rice': 0},{'egg': 0}]
    // console.log(this.array[1].egg)

    // create sound effect
    this.background = this.sound.add("background");
    // this.chop = this.sound.add("chop");
    this.water = this.sound.add("water");

    // create background music
    var musicConfig = {
      mute: false,
      volume: 1,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: true,
      delay: 0
    }
    this.background.play(musicConfig);

    // add group for faucet water bullets
    this.water_bullets = this.physics.add.group({
      defaultKey: "water_bullet",
      maxSize: 30
    });

    this.rice = this.physics.add.group({
      defaultKey: "rice",
      maxSize: 30
    });
    // does creating 'dead' version of rice lead to performance drop?
    this.rice_dead = this.physics.add.group({
      defaultKey: "rice_dead",
      maxSize: 30
    })

    // delay the enemies
    this.timer = this.time.addEvent({
      delay: 1000,
      callback: this.shoot_rice,
      callbackScope: this,
      repeat: 30
    });

    // count to trigger game over scene
    this.count = 30

    // add knife
    // this.knife = this.physics.add.sprite(1920/2, 1080/2, 'knife').setDepth(1)
    // this.knife.setScale(0.5);
    // //this.knife_chopping = false;
    // this.knife.setOrigin(0.9, 0.75)
    //
    // // knife chop tween
    // this.tw = this.tweens.add({
    //   targets: this.knife,
    //   angle: { from: 0, to: 90 },
    //   ease: 'Linear',
    //   duration: 100,
    //   repeat: 1,
    //   yoyo: true
    // });
    this.fires = 0;
    // add animations to enemy
    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers("rice", { start: 0, end: 6 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: "fire1",
      frames: this.anims.generateFrameNumbers("fire", { start: 0, end: 1 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: "fire2",
      frames: this.anims.generateFrameNumbers("fire", { start: 2, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: "fire3",
      frames: this.anims.generateFrameNumbers("fire", { start: 4, end: 5 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: "fire4",
      frames: this.anims.generateFrameNumbers("fire", { start:6, end: 7 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: "fire5",
      frames: this.anims.generateFrameNumbers("fire", { start: 8, end: 9 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: "fire6",
      frames: this.anims.generateFrameNumbers("fire", { start: 10, end: 11 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: "fire7",
      frames: this.anims.generateFrameNumbers("fire", { start: 12, end: 13 }),
      frameRate: 10,
      repeat: -1
    });
  }

  update (time, delta) {
    if(this.fires == 0){
      this.fire.anims.play("fire1", true);
    } else if (this.fires == 1) {
      this.fire.anims.play("fire2", true);
    } else if (this.fires == 2) {
      this.fire.anims.play("fire3", true);
    } else if (this.fires == 3) {
      this.fire.anims.play("fire4", true);
    } else if (this.fires == 4) {
      this.fire.anims.play("fire5", true);
    } else if (this.fires == 5) {
      this.fire.anims.play("fire6", true);
    } else if (this.fires == 6) {
      this.fire.anims.play("fire7", true);
    }

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

    //Game over
    if (this.fires == 7) {
      this.scene.start('GameOverScene');
      return;
    } else if (this.count == 0){
      this.scene.start('GameWinScene', {total_count: this.array[0].rice, enemy_total: 30});
      return;
    }

    // update the riceText
    this.riceText.setText("Rice Coming: " + this.count)

    // collision for water bullets
    this.set_proj_collision(this.water_bullets, this.rice)

    // collision handling for knife
    this.rice.children.iterate(child => {
      child.setInteractive().on(
        'pointerdown',
        function (pointer, localX, localY, event) {
          //this.physics.collide(child,this.knife,hit_enemy)
          child.disableBody(true, true);
          child.destroy();
          this.increment_score(10);
          this.increment_count();
          this.rice_in_pot();
        }.bind(this)
      )
      // child.x += speed + Phaser.Math.Between(0,5);
      // child.anims.play('walk', true)
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

  //   // knife controls
  //   var X = pointer.worldX;
  //   var Y = pointer.worldY;
  //   this.knife.x = X
  //   this.knife.y = Y
  //   if (pointer.isDown && ~this.tw.isPlaying()) {
  //     this.tw.play();
  //     this.chop.play();
  //   }
  }

  // generate water bullets
  shoot_water() {
    var water_bullet = this.water_bullets.get();
    // ensure water_bullet is not null
    if (water_bullet) {
      water_bullet.setAngle(180);
      water_bullet
        .enableBody(true, this.faucet.x, this.faucet.y, true, true)
        .setVelocityY(-900)
        .setDepth(1);
      this.water.play();
    }
  }

  // increments score by given amount
  increment_score(amount) {
      this.score += amount;
  }

  // increments count of rice by given amount
  increment_count(){
    this.array[0].rice += 1;
    console.log(this.array[0].rice);
  }

  // hit function for water
  hit_enemy(projectile, enemy) {
    enemy.disableBody(true, true);
    projectile.disableBody(true, true);
    this.increment_score(10);
    this.increment_count();
    this.rice_in_pot();
  }


  // generate rice enemies
  shoot_rice() {
    var rice_single = this.rice.get();
    if (rice_single) {
      rice_single
        .enableBody(true, 30+Math.random(), 700+100*Math.random()*this.get_random_sign(), true, true)
        .setScale(0.75)
        .setVelocityX(300)
        .setDepth(1)
        .anims.play('walk',true);
      this.count -= 1;
    }

  }

  rice_in_pot() {
    var rice_single = this.rice_dead.get();
    if (rice_single) {
      rice_single
        .enableBody(true, 1920/2+200*Math.random()*this.get_random_sign(), 240+70*Math.random()*this.get_random_sign(), true, true)
        .setScale(0.3)
        .setDepth(1);
    }
  }

  // general function to handle families of projectiles and collisions
  set_proj_collision (proj_group, enemies) {
    proj_group.children.each(
      function (p) {
        if (p.active) {
          this.physics.add.overlap(
            p,
            enemies,
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
    enemies.children.each(
      function (e) {
        if (e.active) {
          if (e.x > this.cameras.main.width) {
            this.fires += 1;
            e.destroy();
          }
        }
      }.bind(this)
    );
  }

  // returns either -1 or +1 at random with equal probability
  get_random_sign() {
    if (Math.random() <= 0.5) {
      return 1;
    } else {
      return -1;
    }
  }
}
