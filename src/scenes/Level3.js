/*global Phaser*/
import * as ChangeScene from './ChangeScene.js';

export default class Level3 extends Phaser.Scene {
  constructor () {
    super('Level3');
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
    this.load.spritesheet("egg_bottom", "./assets/enemy/pEggBot.png", {
      frameHeight: 178,
      frameWidth: 232
    });
    this.load.spritesheet("egg_top", "./assets/enemy/pEggTop.png", {
      frameHeight: 209,
      frameWidth: 232
    });
    this.load.spritesheet("egg_bottom_dead", "./assets/enemy/pEggBot.png", {
      frameHeight: 178,
      frameWidth: 232
    });
    this.load.spritesheet("egg_top_dead", "./assets/enemy/pEggTop.png", {
      frameHeight: 209,
      frameWidth: 232
    });

    this.load.spritesheet("ham", "./assets/enemy/pork.png", {
      frameHeight: 244,
      frameWidth: 713
    });
    this.load.spritesheet("ham_slice", "./assets/enemy/porkSlice.png", {
      frameHeight: 206,
      frameWidth: 153
    });
    this.load.spritesheet("ham_strip", "./assets/enemy/porkStrip.png", {
      frameHeight: 153,
      frameWidth: 152
    });
    this.load.spritesheet("ham_strip_dead", "./assets/enemy/porkStrip.png", {
      frameHeight: 153,
      frameWidth: 152
    });

    this.load.spritesheet("fire", "./assets/background/fire.png", {
      frameHeight: 235,
      frameWidth: 713
    })

    this.load.image('clickboard1', "./assets/background/clickboard.png");
    this.load.image('clickboard2', "./assets/background/clickboard.png");
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

    // load sound files
    this.load.audio("background", ["assets/sounds/background.mp3"]);
    this.load.audio("chop", ["assets/sounds/chop.mp3"]);
    this.load.audio("water", ["assets/sounds/water.mp3"]);
  }

  create (data) {
    // Add event listeners
    ChangeScene.addSceneEventListeners(this);

    // set world boundary
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
    this.faucet_lftime = 0.0; // last time faucet fired water mod 5000
    this.faucet.setCollideWorldBounds(true)
    this.initialEnemy = 30;

    // scoring
    this.score = 0;

    this.riceText = this.add.text(1400, 150, 'Rice Coming: ', { fontSize: '50px', fill: '#000000' }).setDepth(1);
    this.eggText = this.add.text(1400, 200, 'Egg Coming: ', { fontSize: '50px', fill: '#000000' }).setDepth(1);
    this.hamText = this.add.text(1400, 250, 'Ham Coming: ', { fontSize: '50px', fill: '#000000' }).setDepth(1);
    this.tText = this.add.text(125, 150, "Target enemy", { fontSize: '55px', fill: '#000000' }).setDepth(1);
    this.riceView = this.add.sprite(210, 300, 'rice_dead').setScale(0.6).setDepth(1);
    this.eggTopView = this.add.sprite(210, 450, 'egg_top_dead').setScale(0.6).setDepth(1);
    this.eggBottomView = this.add.sprite(360, 450, 'egg_bottom_dead').setScale(0.6).setDepth(1);
    this.hamView = this.add.sprite(360, 300,'ham_strip_dead').setScale(0.6).setDepth(1);
    // dictionary to keep track of score, add enemy types as needed
    // '_total' is just a bound method that gets the amount of all enemies killed

    // create a array
    this.array = [{'rice': 0},{'egg': 0}, {'ham':0}]

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
    //this.background.play(musicConfig);

    // add group for faucet water bullets
    this.water_bullets = this.physics.add.group({
      defaultKey: "water_bullet",
      maxSize: 30
    });

    // ************enemies**************
    this.rice = this.physics.add.group({
      defaultKey: "rice",
      maxSize: 30
    });
    // does creating 'dead' version of rice lead to performance drop?
    this.rice_dead = this.physics.add.group({
      defaultKey: "rice_dead",
      maxSize: 30
    })
    this.egg = this.physics.add.group({
      defaultKey: "egg",
      maxSize: 12
    });
    this.egg_top = this.physics.add.group({
      defaultKey: 'egg_top',
      maxSize: 24,
    });
    this.egg_bottom = this.physics.add.group({
      defaultKey: 'egg_bottom',
      maxSize: 24,
    });
    this.egg_top_dead = this.physics.add.group({
      defaultKey: 'egg_top_dead',
      maxSize: 24,
    });
    this.egg_bottom_dead = this.physics.add.group({
      defaultKey: 'egg_bottom_dead',
      maxSize: 24,
    });
    this.ham = this.physics.add.group({
      defaultKey: 'ham',
      maxSize: 2,
    });
    this.ham_slice = this.physics.add.group({
      defaultKey: 'ham_slice',
      maxSize: 20
    });
    this.ham_strip = this.physics.add.group({
      defaultKey: 'ham_strip',
      maxSize: 80
    });
    this.ham_strip_dead = this.physics.add.group({
      defaultKey: 'ham_strip_dead',
      maxSize: 80
    });

    // delay the enemies
    this.timer_rice = this.time.addEvent({
      delay: 1500,
      callback: this.shoot_rice,
      callbackScope: this,
      repeat: 30
    });
    this.timer_egg = this.time.addEvent({
      delay: 4000,
      callback: this.shoot_egg,
      callbackScope: this,
      repeat: 12,
      startAt: -2200
    })
    this.timer_ham = this.time.addEvent({
      delay: 12000,
      callback: this.shoot_ham,
      callbackScope: this,
      repeat: 2,
      startAt: 0
      //startAt: -13000
    })
    // add animations to enemy
    this.anims.create({
      key: "walk_rice",
      frames: this.anims.generateFrameNumbers("rice", { start: 0, end: 6 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: "idle_rice",
      frames: this.anims.generateFrameNumbers("rice", { start: 0, end: 0 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: "walk_egg",
      frames: this.anims.generateFrameNumbers("egg", { start: 0, end: 6 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: "idle_egg",
      frames: this.anims.generateFrameNumbers("egg", { start: 0, end: 0 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: "walk_egg_b",
      frames: this.anims.generateFrameNumbers("egg_bottom", { start: 0, end: 6 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: "idle_egg_b",
      frames: this.anims.generateFrameNumbers("egg_bottom", { start: 0, end: 0 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: "idle_egg_t",
      frames: this.anims.generateFrameNumbers("egg_top", { start: 0, end: 0 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: "walk_egg_t",
      frames: this.anims.generateFrameNumbers("egg_top", { start: 0, end: 6 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: "fire",
      frames: this.anims.generateFrameNumbers("fire", { start: 0, end: 1 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: "walk_ham",
      frames: this.anims.generateFrameNumbers("ham", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: "idle_ham",
      frames: this.anims.generateFrameNumbers("ham", { start: 0, end: 0 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: "walk_ham_slice",
      frames: this.anims.generateFrameNumbers("ham_slice", { start: 0, end: 3}),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: "idle_ham_slice",
      frames: this.anims.generateFrameNumbers("ham_slice", { start: 0, end: 0}),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: "walk_ham_strip",
      frames: this.anims.generateFrameNumbers("ham_strip", { start: 0, end: 3}),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: "idle_ham_strip",
      frames: this.anims.generateFrameNumbers("ham_strip", { start: 0, end: 0}),
      frameRate: 10,
      repeat: -1
    })

    // **********end enemy stuff*************

    // count to trigger game over scene
    this.count = 44
    this.riceCount = 30
    this.eggCount = 12
    this.hamCount = 2

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
      repeat: 0,
      yoyo: true
    });
    // last time knife chopped mod 5000
    this.knife_lctime = 0;
  }

  update (time, delta) {
    this.fire.anims.play("fire", true);
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

    // update board
    this.riceText.setText("Rice coming: " + this.riceCount)
    this.eggText.setText("Egg coming: " + this.eggCount)
    this.hamText.setText("Ham coming: " + this.hamCount)

    // touch/mouse listening
    var pointer = this.input.activePointer;
    // faucet speed
    var faucet_speed = 8;
    // set speed of enemy and assign events
    var speed = 2;
    // firing rate for faucet in miliseconds
    var frate_faucet = 300;

    // collision for water bullets
    this.set_proj_collision_rice(this.water_bullets, this.rice)
    // collision for egg group
    this.set_proj_collision_egg_b(this.water_bullets, this.egg_bottom)
    this.set_proj_collision_egg_t(this.water_bullets, this.egg_top)
    // collision for ham group
    this.set_proj_collision_ham_strip(this.water_bullets, this.ham_strip)

    this.egg.children.iterate(function(child) {
      // make sure child is not null, i.e. hasn't spawned yet
      if (pointer.isDown && ~this.tw.isPlaying() && child) {
        if (this.physics.world.overlap(child, this.knife)) {
          // position
          X = child.x
          Y = child.y
          child.disableBody(true, true);
          child.destroy();
          this.spawn_half_egg(X, Y)
          this.increment_score(10);
          this.increment_count('egg');
        }
      }
    }, this);

    this.ham.children.iterate(function(child) {
      // make sure child is not null, i.e. hasn't spawned yet
      if (pointer.isDown && ~this.tw.isPlaying() && child) {
        if (this.physics.world.overlap(child, this.knife)) {
          // position
          X = child.x
          Y = child.y
          child.disableBody(true, true);
          this.spawn_ham(X, Y, 'slice', time)
          child
            .enableBody(true, X, Y, true, true)
            .setScale(0.75)
            .setVelocityX(150)
            .setDepth(1)
            .anims.play('walk_ham',true);
          //this.increment_score(10);
          //this.increment_count('egg');
        }
      }
    }, this);

    this.ham_slice.children.iterate(function(child) {
      // make sure child is not null, i.e. hasn't spawned yet
      if (pointer.isDown && ~this.tw.isPlaying() && child) {
        if (this.physics.world.overlap(child, this.knife)) {
          // position
          X = child.x
          Y = child.y
          child.disableBody(true, true);
          child.destroy();
          this.spawn_ham(X, Y, 'strip', time)
          //this.increment_score(10);
          //this.increment_count('ham');
        }
      }
    }, this);

    // winning condition check
    this.total_count = this.array[0].rice + this.array[1].egg + this.array[2].ham

    if (this.count == 0 && this.total_count < 50) {
      this.scene.start('GameOverScene');
      return;
    } else if (this.count == 0 && this.total_count >= 50) {
      this.scene.start('GameWinScene', {total_count: this.total_count, enemy_total:90});
      return;
    }

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
      this.knife_lctime = Phaser.Math.Wrap(time, 0, 5000)
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
  }

  // increments count of given enemy type
  increment_count(type) {
    if (type == 'rice'){
      this.array[0].rice += 1
    }else if(type == 'egg'){
      this.array[1].egg += 1
    } else{
      this.array[2].ham += 1
    }
  }

  // water hit function for rice
  hit_enemy_rice(projectile, enemy) {
    enemy.disableBody(true, true);
    projectile.disableBody(true, true);
    this.increment_score(10);
    this.increment_count('rice');
    this.rice_in_pot();
  }
  // water hit function for (chopped) eggs
  hit_enemy_egg_b(projectile, enemy) {
    enemy.disableBody(true, true);
    projectile.disableBody(true, true);
    this.increment_score(10);
    this.increment_count('egg');
    this.egg_in_pot('bottom');
  }

  // water hit function for (chopped) eggs
  hit_enemy_egg_t(projectile, enemy) {
    enemy.disableBody(true, true)
    projectile.disableBody(true, true);
    this.increment_score(10);
    this.increment_count('egg');
    this.egg_in_pot('top');
  }

  hit_enemy_ham_strip(projectile, enemy) {
    enemy.disableBody(true, true)
    projectile.disableBody(true, true);
    this.increment_score(10);
    this.increment_count('ham');
    this.ham_in_pot();
  }

  // generate rice enemies
  shoot_rice() {
    var rice_single = this.rice.get();
    if (rice_single) {
      rice_single
        .enableBody(true, 30+Math.random(), 700+100*Math.random()*this.rand_sign(), true, true)
        .setScale(0.75)
        .setVelocityX(300)
        .setDepth(1)
        .anims.play('walk_rice',true);
      this.count -= 1;
      this.riceCount -= 1;
    }
  }

  // generate egg enemies
  shoot_egg() {
    var egg_single = this.egg.get();
    if (egg_single) {
      egg_single
        .enableBody(true, 30+Math.random(), 700+100*Math.random()*this.rand_sign(), true, true)
        .setScale(0.75)
        .setVelocityX(150)
        .setDepth(1)
        .anims.play('walk_egg',true);
      this.count -= 1;
      this.eggCount -= 1;
    }
  }

  // generate ham enemies
  shoot_ham() {
    var ham_single = this.ham.get();
    if (ham_single) {
      ham_single
        .enableBody(true, 30+Math.random(), 700+100*Math.random()*this.rand_sign(), true, true)
        .setScale(0.75)
        .setVelocityX(150)
        .setDepth(1)
        .anims.play('walk_ham',true);
      this.count -= 1;
      this.hamCount -= 1;
    }
  }

  // spawns 4 ham of specified type at the given x,y
  // very buggy; spawns 2 ham instead of one
  // note: maybe add a callback to the tween instead of this method
  spawn_ham(x, y, type, time) {
    // make sure the knife hasn't chopped in the last 100 ms
    var diff = Phaser.Math.Difference(time, this.knife_lctime)
    if (diff < 100) return;
    if (type == 'slice') {
      var h1 = this.ham_slice.get()
      if (h1) {
        h1
          .enableBody(true,(-100)*Math.random() + x,30*Math.random()*this.rand_sign() + y, true, true)
          .setScale(0.75)
          .setVelocityX(200)
          .setDepth(2)
          .anims.play('walk_ham_slice', true)
        console.log('slice spawned')
      }
    } else if (type == 'strip') {
      var h1 = this.ham_strip.get()
      var h2 = this.ham_strip.get()
      var h3 = this.ham_strip.get()
      var h4 = this.ham_strip.get()
      if (h1 && h2 && h3 && h4) {
        h1
          .enableBody(true,(-100)*Math.random() + x,30*Math.random()*this.rand_sign() + y, true, true)
          .setScale(0.3)
          .setVelocityX(200)
          .setDepth(3)
          .anims.play('walk_ham_strip', true)
        h2
          .enableBody(true,(-100)*Math.random() + x,30*Math.random()*this.rand_sign() + y, true, true)
          .setScale(0.3)
          .setVelocityX(200)
          .setDepth(3)
          .anims.play('walk_ham_strip', true)
        h3
          .enableBody(true,(-100)*Math.random() + x,30*Math.random()*this.rand_sign() + y, true, true)
          .setScale(0.3)
          .setVelocityX(200)
          .setDepth(3)
          .anims.play('walk_ham_strip', true)
        h4
          .enableBody(true,(-100)*Math.random() + x,30*Math.random()*this.rand_sign() + y, true, true)
          .setScale(0.3)
          .setVelocityX(200)
          .setDepth(3)
          .anims.play('walk_ham_strip', true)
        console.log('strips spawned')
      }
    }
  }

  // spawns 2 cut eggs at the given x,y position
  spawn_half_egg(x, y) {
    var egg1 = this.egg_bottom.get()
    var egg2 = this.egg_top.get()
    if (egg1) {
      egg1
        .enableBody(true,(-100)*Math.random() + x,30*Math.random()*this.rand_sign() + y, true, true)
        .setScale(0.75)
        .setVelocityX(200)
        .setDepth(1)
        .anims.play('walk_egg_b', true)
    }
    if (egg2) {
      egg2
      .enableBody(true,(-100)*Math.random()+x,30*Math.random()*this.rand_sign()+y, true, true)
      .setScale(0.75)
      .setVelocityX(200)
      .setDepth(1)
      .anims.play('walk_egg_t', true)
    }
  }

  rice_in_pot() {
    var rice_single = this.rice_dead.get();
    if (rice_single) {
      rice_single
        .enableBody(true, 1920/2+200*Math.random()*this.rand_sign(), 240+70*Math.random()*this.rand_sign(), true, true)
        .setScale(0.3)
        .setDepth(1);
    }
  }

  egg_in_pot(type) {
    if (type == 'top') {
      var egg_single = this.egg_top_dead.get()
      if (egg_single) {
        egg_single
          .enableBody(true, 1920/2+200*Math.random()*this.rand_sign(), 240+70*Math.random()*this.rand_sign(), true, true)
          .setScale(0.3)
          .setDepth(1);
      }
    } else if (type == 'bottom') {
      var egg_single = this.egg_bottom_dead.get()
      if (egg_single) {
        egg_single
          .enableBody(true, 1920/2+200*Math.random()*this.rand_sign(), 240+70*Math.random()*this.rand_sign(), true, true)
          .setScale(0.3)
          .setDepth(1);
      }
    }
  }

  ham_in_pot() {
    var ham_single = this.ham_strip_dead.get();
    if (ham_single) {
      ham_single
        .enableBody(true, 1920/2+200*Math.random()*this.rand_sign(), 240+70*Math.random()*this.rand_sign(), true, true)
        .setScale(0.3)
        .setDepth(1);
    }
  }

  // rice collision function
  set_proj_collision_rice (proj_group, enemies) {
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

  // egg collision function
  set_proj_collision_egg_b (proj_group, enemies) {
    proj_group.children.each(
      function (p) {
        if (p.active) {
          this.physics.add.overlap(
            p,
            enemies,
            this.hit_enemy_egg_t,
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

  // egg collision function
  set_proj_collision_egg_t (proj_group, enemies) {
    proj_group.children.each(
      function (p) {
        if (p.active) {
          this.physics.add.overlap(
            p,
            enemies,
            this.hit_enemy_egg_b,
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

  // egg collision function
  set_proj_collision_ham_strip (proj_group, enemies) {
    proj_group.children.each(
      function (p) {
        if (p.active) {
          this.physics.add.overlap(
            p,
            enemies,
            this.hit_enemy_ham_strip,
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
  rand_sign() {
    if (Math.random() <= 0.5) {
      return 1;
    } else {
      return -1;
    }
  }
}
