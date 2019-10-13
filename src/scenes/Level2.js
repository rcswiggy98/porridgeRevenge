/*global Phaser*/
import * as ChangeScene from './ChangeScene.js';

export default class Level2 extends Phaser.Scene {
  constructor () {
    super('Level2');
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

    this.load.spritesheet("egg", "./assets/enemy/pEggWhole.png", {
      frameHeight: 326,
      frameWidth: 250
    });

    this.load.spritesheet("egg_dead", "./assets/enemy/pEggWhole.png", {
      frameHeight: 326,
      frameWidth: 250
    });

    this.load.image('board', "./assets/background/board.png");
    this.load.image('pot', "./assets/background/pot.png");
    this.load.image('stove', "./assets/background/stove.png");
    this.load.image('faucet', "./assets/player/faucet.png");
    this.load.image('water_bullet', "./assets/player/waterdrop.png");
    this.load.image('knife', "./assets/player/knife.png");
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
    this.physics.world.setBounds(0, 900, 1920, 210);

    // add background
    const pot = this.add.sprite(1920 / 2, 300 , 'pot').setScale(0.8).setDepth(1);
    const stove = this.add.sprite(1920 / 2, 375 , 'stove');
    const board = this.add.sprite(1920 / 2, 900 , 'board');

    // add faucet
    this.faucet = this.physics.add.sprite(1920/2, 1080, 'faucet');
    this.faucet.setScale(0.5);
    this.faucet_lftime = 0.0; // last time faucet fired water mod 5000
    this.score = 0;
    this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#550' });
    this.initialEnemy = 30;

    // create a array
    this.array = [{'rice': 0},{'egg': 0}]
    // console.log(this.array[1].egg)

    // create sound effect
    this.background = this.sound.add("background");
    this.chop = this.sound.add("chop");
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

    // add group for rice
    this.rice = this.physics.add.group({
      defaultKey: "rice",
      maxSize: 30
    });

    // add group for preserved egg
    this.egg = this.physics.add.group({
      defaultKey: "egg",
      maxSize: 30
    });

    // 'dead' version of rice
    this.rice_dead = this.physics.add.group({
      defaultKey: "rice_dead",
      maxSize: 30
    })

    //'dead' version of egg
    this.egg_dead = this.physics.add.group({
      defaultKey: "egg_dead",
      maxSize: 30
    })

    // delay the enemies
    this.timer = this.time.addEvent({
      delay: 2000,
      callback: this.shoot_rice,
      callbackScope: this,
      repeat: 30
    });


    // count to trigger game over scene
    this.count = this.timer.repeat

    // add knife
    this.knife = this.physics.add.sprite(1920/2, 1080/2, 'knife').setDepth(1)
    this.knife.setScale(0.5);
    //this.knife_chopping = false;
    this.knife.setOrigin(0.9, 0.75)

    // knife chop tween
    this.tw = this.tweens.add({
      targets: this.knife,
      angle: { from: 0, to: 90 },
      ease: 'Linear',
      duration: 100,
      repeat: 1,
      yoyo: true
    });

    // add animations to enemy
    this.anims.create({
      key: "rice_walk",
      frames: this.anims.generateFrameNumbers("rice", { start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: "egg_walk",
      frames: this.anims.generateFrameNumbers("egg", { start: 0, end: 5 }),
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

    //Game over
    if (this.count == 0 && this.array[0].rice <15) {
      this.scene.start('GameOverScene', {score: this.score});
      return;
    } else if (this.count == 0 && this.array[0].rice >15){
      this.scene.start('GameWinScene', {score: this.score});
      return;
    }

    // collision for water bullets
    this.set_proj_collision(this.water_bullets, this.rice)

    // collision for egg group
    this.set_proj_collision(this.water_bullets, this.egg)

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

    // knife controls
    var X = pointer.worldX;
    var Y = pointer.worldY;
    this.knife.x = X
    this.knife.y = Y
    if (pointer.isDown && ~this.tw.isPlaying()) {
      this.tw.play();
      this.chop.play();
    }
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
      this.scoreText.setText("Score: " + this.score)
  }

  // increments count of rice by given amount
  increment_count_rice(){
    this.array[0].rice += 1;
    console.log(this.array[0].rice);
  }

  // increments count of egg by given amount
  increment_count_egg(){
    this.array[0].egg += 1;
    console.log(this.array[0].egg);
  }

  // water hit function for rice
  hit_enemy_rice(projectile, enemy) {
    enemy.disableBody(true, true);
    projectile.disableBody(true, true);
    this.increment_score(10);
    this.increment_count_rice();
    this.rice_in_pot();
  }

  // water hit function for egg
  hit_enemy_egg(projectile, enemy) {
    enemy.disableBody(true, true);
    projectile.disableBody(true, true);
    this.increment_score(10);
    this.increment_count_egg();
    this.egg_in_pot();
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
        .anims.play('rice_walk',true);
      this.count -= 1;
    }
  }

  // generate egg enemies
  shoot_egg() {
    var egg_single = this.egg.get();
    if (egg_single) {
      egg_single
        .enableBody(true, 30+Math.random(), 700+100*Math.random()*this.get_random_sign(), true, true)
        .setScale(0.75)
        .setVelocityX(150)
        .setDepth(1)
        .anims.play('egg_walk',true);
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

  egg_in_pot() {
    var egg_single = this.egg_dead.get();
    if (egg_single) {
      egg_single
        .enableBody(true, 1920/2+200*Math.random()*this.get_random_sign(), 240+70*Math.random()*this.get_random_sign(), true, true)
        .setScale(0.3)
        .setDepth(1);
    }
  }

  // rice collision function
  set_proj_collision (proj_group, enemies) {
    proj_group.children.each(
      function (p) {
        if (p.active) {
          this.physics.add.overlap(
            p,
            enemies,
            this.hit_enemy_rice,
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

  // returns either -1 or +1 at random with equal probability
  get_random_sign() {
    if (Math.random() <= 0.5) {
      return 1;
    } else {
      return -1;
    }
  }
}
