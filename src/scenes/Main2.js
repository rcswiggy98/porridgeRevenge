/*global Phaser*/
import * as ChangeScene from './ChangeScene.js';

export default class MainScene extends Phaser.Scene {
  constructor () {
    super('Main2');
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
    this.load.spritesheet('egg', "./assets/enemy/pEggHalf.png", {
      frameHeight: 326,
      frameWidth: 250
    });
    this.load.spritesheet('egg_bottom', "./assets/enemy/pEggBot.png", {
      frameHeight: 178,
      frameWidth: 232
    });
    this.load.spritesheet('egg_top', "./assets/enemy/pEggTop.png", {
      frameHeight: 209,
      frameWidth: 232
    })

    this.load.image('board', "./assets/background/board.png");
    this.load.image('pot', "./assets/background/pot.png");
    this.load.image('stove', "./assets/background/stove.png");
    this.load.image('faucet', "./assets/player/faucet.png");
    this.load.image('water_bullet', "./assets/player/waterdrop.png");
    this.load.image('knife', "./assets/player/knife.png");
    this.load.image('rice_dead', "./assets/enemy/rice.png")
    // no death clone yet for egg, do we need one?
    // this.load.image('egg_dead', "./assets/enemy")

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;

    // load sound files
    this.load.audio("background", ["assets/sounds/background.mp3"]);
    this.load.audio("chop", ["assets/sounds/chop.mp3"]);
    this.load.audio("water", ["assets/sounds/water.mp3"]);
  }

  create (data) {
    // add event listeners
    ChangeScene.addSceneEventListeners(this);

    // set world boundary
    this.physics.world.setBounds(0, 900, 1920, 210);

    // add background
    const pot = this.add.sprite(1920 / 2, 300 , 'pot').setScale(0.8).setDepth(1);
    const stove = this.add.sprite(1920 / 2, 375 , 'stove');
    const board = this.add.sprite(1920 / 2, 900 , 'board');

    // add faucet
    this.faucet = this.physics.add.sprite(1920/2, 1080, 'faucet');
    this.faucet.setScale(0.5);
    this.faucet_lftime = 0.0; // last time faucet fired water mod 5000

    this.initialEnemy = 30;

    // scoring
    this.score = 0;
    this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#550' });

    // dictionary to keep track of score, add enemy types as needed
    // '_total' is just a bound method that gets the amount of all enemies killed
    this.deadEnemies = {
      'egg': 0,
      'rice': 0,
      '_total': function() {
        var total = 0
        for(k in this.deadEnemies) {
          if (k != '_total') {
            total += this.deadEnemies[k]
          }
        }
        return total;
      }
    }

    // add sound effects
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
      maxSize: 30
    });
    this.egg_top = this.physics.add.group({
      defaultKey: 'egg_top',
      maxSize: 30,
    })
    this.egg_bottom = this.physics.add.group({
      defaultKey: 'egg_bottom',
      maxSize: 30
    })

    // delay the enemies
    this.timer_rice = this.time.addEvent({
      delay: 1000,
      callback: this.shoot_rice,
      callbackScope: this,
      repeat: 30
    });
    this.timer_egg = this.time.addEvent({
      delay: 900,
      callback: this.shoot_egg,
      callbackScope: this,
      repeat: 15,
      startAt: -1000
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
    })
    // *********end enemy stuff*************

    // count to trigger game over scene
    this.count = 45

    // add knife
    this.knife = this.physics.add.sprite(1920/2, 1080/2, 'knife').setDepth(1)
    this.knife.setScale(0.5);
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
    this.set_proj_collision(this.water_bullets, this.rice)
    this.set_proj_collision(this.water_bullets, this.egg)

    // collision handling for knife
    this.rice.children.iterate(function(child) {
      // make sure child is not null, i.e. hasn't spawned yet
      if (pointer.isDown && ~this.tw.isPlaying() && child) {
        if (this.physics.world.overlap(child, this.knife)) {
          child.disableBody(true, true);
          child.destroy();
          this.increment_score(10);
          this.increment_count('rice');
          this.rice_in_pot()
        }
      }
    }, this);
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
    this.egg_top.children.iterate(function(child) {
      // make sure child is not null, i.e. hasn't spawned yet
      if (pointer.isDown && ~this.tw.isPlaying() && child) {
        if (this.physics.world.overlap(child, this.knife)) {
          child.disableBody(true, true);
          child.destroy();
          this.increment_score(10);
          this.increment_count('egg');
        }
      }
    }, this);
    this.egg_bottom.children.iterate(function(child) {
      // make sure child is not null, i.e. hasn't spawned yet
      if (pointer.isDown && ~this.tw.isPlaying() && child) {
        if (this.physics.world.overlap(child, this.knife)) {
          child.disableBody(true, true);
          child.destroy();
          this.increment_score(10);
          this.increment_count('egg');
        }
      }
    }, this);

    // winning condition check
    if (this.count == 0 && this.deadEnemies['_total']() < 30) {
      this.scene.start('GameOverScene', {score: this.score});
      return;
    } else if (this.count == 0 && this.deadEnemies['_total']() > 30) {
      this.scene.start('GameWinScene', {score: this.score});
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

  // increments count of given enemy type 
  increment_count(type) {
    this.deadEnemies[type] += 1;
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
        .enableBody(true, 30+Math.random(), 700+100*Math.random()*this.rand_sign(), true, true)
        .setScale(0.75)
        .setVelocityX(300)
        .setDepth(1)
        .anims.play('walk_rice',true);
      this.count -= 1;
    }
  }

  // generate (whole) egg enemies
  shoot_egg() {
    var egg = this.egg.get();
    if (egg) {
      egg
        .enableBody(true, 30+Math.random(), 700+100*Math.random()*this.rand_sign(), true, true)
        .setScale(0.75)
        .setVelocityX(300)
        .setDepth(1)
        .anims.play('walk_egg',true);
      this.count -= 1;
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

  /** 
  egg_in_pot() {
    var rice_single = this.rice_dead.get();
    if (rice_single) {
      rice_single
        .enableBody(true, 1920/2+200*Math.random()*this.rand_sign(), 240+70*Math.random()*this.rand_sign(), true, true)
        .setScale(0.3)
        .setDepth(1);
    }
  }
  */

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
