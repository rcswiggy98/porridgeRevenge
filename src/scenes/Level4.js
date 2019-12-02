/*global Phaser*/
import * as ChangeScene from './ChangeScene.js';

export default class Level4 extends Phaser.Scene {
  constructor () {
    super('Level4');
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
    this.load.spritesheet("egg_dead", "./assets/enemy/pEggWhole.png", {
      frameHeight: 326,
      frameWidth: 250
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
    this.load.spritesheet("ham_dead", "./assets/enemy/pork.png", {
      frameHeight: 244,
      frameWidth: 713
    });
    this.load.spritesheet("ham_slice", "./assets/enemy/porkSlice.png", {
      frameHeight: 206,
      frameWidth: 153
    });
    this.load.spritesheet("ham_slice_dead", "./assets/enemy/porkSlice.png", {
      frameHeight: 206,
      frameWidth: 153
    });


    this.load.spritesheet("fire", "./assets/background/fire.png", {
      frameHeight: 235,
      frameWidth: 713
    })

    this.load.image('clickboard1', "./assets/background/clickboard.png");
    this.load.image('clickboard2', "./assets/background/clickboard2.png");
    this.load.image('board', "./assets/background/board.png");
    this.load.image('pot', "./assets/background/pot.png");
    this.load.image('stove', "./assets/background/stove.png");
    this.load.image('faucet', "./assets/player/faucet.png");
    this.load.image('water_bullet', "./assets/player/waterdrop.png");
    this.load.image('knife', "./assets/player/knife.png");
    this.load.image('rice_dead', "./assets/enemy/rice.png");
    this.load.image('upgrade', "./assets/UI/upGrade.png");
    this.load.image('upgradeK', "./assets/UI/upGradeK.png");
    this.load.image('fireSingle', "./assets/background/fireSingle.png");
    this.load.image('Bar', "./assets/UI/Bar.png");
    this.load.image('riceBar', "./assets/UI/riceBar.png");
    this.load.image('eggBar', "./assets/UI/eggBar.png");
    this.load.image('hamBar', "./assets/UI/hamBar.png");
    this.load.image('waterBar', "./assets/UI/waterBar.png");
    this.load.image('fireBar', "./assets/UI/fireBar.png");
    this.load.image('pause', "./assets/UI/pause.png");
    this.load.image('resume', "./assets/UI/resume.png");

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
    this.scene.launch("Pause4");
    this.scene.sleep();
    // set world boundary
    this.physics.world.setBounds(0, 0, 1920, 1080);

    // add background
    const stove = this.add.sprite(1400, 375 , 'stove');
    const board = this.add.sprite(1920 / 2, 900 , 'board');
    //const clickboard1 = this.add.sprite(1920 / 6, 325 , 'clickboard1').setScale(1.1).setDepth(1);
    const clickboard2 = this.add.sprite(500, 325 , 'clickboard2').setScale(1.1).setDepth(1);
    const pot = this.add.sprite(1400, 300 , 'pot').setScale(0.8).setDepth(1);
    this.fire = this.add.sprite(1400, 500, 'fire').setScale(0.8).setDepth(1);
    // add faucet
    this.faucet = this.physics.add.sprite(1920/2, 1080, 'faucet');
    this.faucet.setScale(0.5);
    this.faucet_lftime = 0.0; // last time faucet fired water mod 5000
    this.faucet.setCollideWorldBounds(true);
    this.fires = 0;
    this.waterCount = 15;
    this.hamC = 1;
    this.initialEnemy = 30;

    this.pause = this.add.image(1880, 100, 'pause').setScale(1).setInteractive();
    this.pause.on("pointerup",function(){
      this.scene.launch("Pause4");
      this.scene.sleep();
    }, this
    );


    // scoring
    this.score = 0;

    // add UI
    this.rightClickboard1 = this.add.text(125, 100, 'Remaining Ingredients', {fontFamily:'indie_flower', fontSize: '40px', fill: '#000000' }).setDepth(1);
    this.riceR = this.add.sprite(150, 175, 'rice_dead').setScale(0.3).setDepth(1);
    this.riceText = this.add.text(690, 175, 'Rice: ', {fontFamily:'indie_flower', fontSize: '30px', fill: '#000000' }).setDepth(1);
    this.eggR = this.add.sprite(150, 250, 'egg_dead').setScale(0.2).setDepth(1);
    this.eggText = this.add.text(690, 250, 'Egg: ', {fontFamily:'indie_flower', fontSize: '30px', fill: '#000000' }).setDepth(1);
    this.hamR = this.add.sprite(150, 325,'ham_dead').setScale(0.1).setDepth(1);
    this.hamText = this.add.text(690, 325, 'Ham: ', {fontFamily:'indie_flower', fontSize: '30px', fill: '#000000' }).setDepth(1);

    this.rightClickboard2 = this.add.text(125, 350, 'Remaining Stamina', {fontFamily:'indie_flower', fontSize: '40px', fill: '#000000' }).setDepth(1);
    this.waterR = this.add.sprite(150, 425, 'water_bullet').setScale(0.5).setDepth(1);
    this.waterText = this.add.text(690, 425, 'Water: ', {fontFamily:'indie_flower', fontSize: '30px', fill: '#000000' }).setDepth(1);
    this.fireR = this.add.sprite(150, 500, 'fireSingle').setScale(0.3).setDepth(1);
    this.fireText = this.add.text(690, 500, 'Fire: ', {fontFamily:'indie_flower', fontSize: '30px', fill: '#000000' }).setDepth(1);
    //this.tText = this.add.text(105, 100, "Target Ingredients", { fontSize: '40px', fill: '#000000' }).setDepth(1);

    this.Bar1 = this.add.sprite(420, 175,'Bar').setDepth(2);
    this.Bar2 = this.add.sprite(420, 250,'Bar').setDepth(2);
    this.Bar3 = this.add.sprite(420, 325,'Bar').setDepth(2);
    this.Bar4 = this.add.sprite(420, 425,'Bar').setDepth(2);
    this.Bar5 = this.add.sprite(420, 500,'Bar').setDepth(2);
    this.riceBar = this.add.sprite(420, 175,'riceBar').setDepth(1);
    this.eggBar = this.add.sprite(420, 250,'eggBar').setDepth(1);
    this.hamBar = this.add.sprite(420, 325,'hamBar').setDepth(1);
    this.waterBar = this.add.sprite(420, 425,'waterBar').setDepth(1);
    this.fireBar = this.add.sprite(420, 500,'fireBar').setDepth(1);




    // this.riceView = this.add.sprite(210, 300, 'rice_dead').setScale(0.6).setDepth(1);
    // this.eggTopView = this.add.sprite(210, 450, 'egg_top_dead').setScale(0.6).setDepth(1);
    // this.eggBottomView = this.add.sprite(360, 450, 'egg_bottom_dead').setScale(0.6).setDepth(1);
    // this.hamView = this.add.sprite(360, 300,'ham_slice_dead').setScale(0.6).setDepth(1);
    this.faster_bullet = false;
    this.bigger_knife = false;
    // dictionary to keep track of score, add enemy types as needed
    // '_total' is just a bound method that gets the amount of all enemies killed

    // create a array
    this.array = [{'rice': 0},{'egg': 0}, {'ham':0}]

    var pointer = this.input.activePointer;

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
    this.ham_slice_dead = this.physics.add.group({
      defaultKey: 'ham_slice_dead',
      maxSize: 20
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
      delay: 15000,
      callback: this.shoot_ham,
      callbackScope: this,
      repeat: 1,
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

    // **********end enemy stuff*************

    // count to trigger game over scene
    this.count = 44
    this.riceCount = 30
    this.eggCount = 12
    this.hamCount = 2

    // add knife
    this.knife = this.physics.add.sprite(1920/2, 1080/2, 'knife').setDepth(3);
    this.knife.setScale(0.3);
    //this.knife_chopping = false;
    this.knife.setOrigin(0.9, 0.75)
    // knife chop tween
    this.tw = this.tweens.add({
        targets: this.knife,
        angle: { from: 0, to: 90 },
        ease: 'Linear',
        duration: 100,
        repeat: 0,
        yoyo: true,
        onComplete: this.checkKnifeColl,
        onCompleteScope: this
        //onStartParams: [this.ham.getChildren(), this.ham_slice.getChildren()]
      });
    // last time knife chopped mod 5000
    this.knife_lctime = 0;

    this.chop_time = 0


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

    // update board
    this.riceText.setText("Rice: " + this.riceCount);
    this.eggText.setText("Egg: " + this.eggCount);
    this.hamText.setText("Ham: " + this.hamCount);
    this.waterText.setText("Water: " + this.waterCount);
    this.fireText.setText("Fire: " + (7 - this.fires));
    this.riceBar.setScale(this.riceCount/30, 1).setX(420 - this.riceBar.width/2 + this.riceBar.displayWidth/2);
    this.eggBar.setScale(this.eggCount/12, 1).setX(420 - this.eggBar.width/2 + this.eggBar.displayWidth/2);
    this.hamBar.setScale(this.hamCount/2, 1).setX(420 - this.hamBar.width/2 + this.hamBar.displayWidth/2);
    this.waterBar.setScale(this.waterCount/15, 1).setX(420 - this.waterBar.width/2 + this.waterBar.displayWidth/2);
    this.fireBar.setScale((7 - this.fires)/7, 1).setX(420 - this.fireBar.width/2 + this.fireBar.displayWidth/2);



    // touch/mouse listening
    var pointer = this.input.activePointer;
    // faucet speed
    var faucet_speed = 8;
    // set speed of enemy and assign events
    var speed = 2;
    // firing rate for faucet in miliseconds
    if (this.faster_bullet){
      var frate_faucet = 100;
    } else {
      var frate_faucet = 400;
    }
    var chop_knife = 1000;

    // collision for water bullets
    this.set_proj_collision_rice(this.water_bullets, this.rice)
    // collision for egg group
    this.set_proj_collision_egg_b(this.water_bullets, this.egg_bottom)
    this.set_proj_collision_egg_t(this.water_bullets, this.egg_top)
    this.set_proj_collision_egg_w(this.egg);
    this.set_proj_collision_ham_w(this.ham);
    // collision for ham group
    this.set_proj_collision_ham_slice(this.water_bullets, this.ham_slice)
    // collision for upgrade and faucet
    this.set_proj_collision_upgrade(this.upgrade, this.faucet)
    this.set_proj_collision_upgradeK(this.upgrade, this.knife)

    // trigger upgrade to appear
    if (pointer.isDown && ~this.tw.isPlaying()) {
      if (this.physics.world.overlap(this.ham, this.knife)) {
        this.chop_time += 1
        //console.log(this.chop_time)
      }
      if (this.chop_time == 10){
        this.upgrade = this.physics.add.sprite(300, 16, "upgrade").setScale(0.2).setDepth(3);
        this.upgrade.setBounce(1);
        this.upgrade.setCollideWorldBounds(true);
        this.upgrade.setVelocity(Phaser.Math.Between(-200, 200), 20);
        this.upgrade.setGravityY(100);
        this.upgradeK = this.physics.add.sprite(300, 16, "upgradeK").setScale(0.2).setDepth(3);
        this.upgradeK.setBounce(1);
        this.upgradeK.setCollideWorldBounds(true);
        this.upgradeK.setVelocity(Phaser.Math.Between(-200, 200), 20);
        this.upgradeK.setGravityY(100);
      }
    }

    if (this.bigger_knife == true){
      this.knife.setScale(0.5)
    } else if (this.bigger_knife == false){
      this.knife.setScale(0.3)
    }

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

    // this.ham.children.iterate(function(child) {
    //   // make sure child is not null, i.e. hasn't spawned yet
    //   if (pointer.isDown && ~this.tw.isPlaying() && child) {
    //     if (this.physics.world.overlap(child, this.knife)) {
    //       // position
    //       X = child.x
    //       Y = child.y
    //       child.disableBody(true, true);
    //       this.spawn_ham(X, Y, 'slice', time)
    //       child
    //         .enableBody(true, X, Y, true, true)
    //         .setScale(0.75)
    //         .setVelocityX(150)
    //         .setDepth(1)
    //         .anims.play('walk_ham',true);
    //       //this.increment_score(10);
    //       //this.increment_count('egg');
    //     }
    //   }
    // }, this);

    // winning condition check
    this.total_count = this.array[0].rice + this.array[1].egg + this.array[2].ham

    if (this.fires >= 7 || this.waterCount == 0) {
      this.scene.start('GameOverScene');
      return;
    } else if (this.count == 0) {
      this.scene.start('GameWinScene', {total_count: this.total_count, enemy_total:72, level:3});
      return;
    }


    // faucet controls
    if (keys.left.isDown) {
      this.faucet.x -= faucet_speed;
    } else if (keys.right.isDown) {
      this.faucet.x += faucet_speed;
    }
    if (keys.space.isDown || keys.up.isDown) {
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
    this.knife.x = X;
    this.knife.y = Y;
    if (pointer.isDown && ~this.tw.isPlaying()) {
      var mod_time1 = Phaser.Math.Wrap(time, 0, 5000)
      if (Phaser.Math.Difference(mod_time1,this.knife_lctime) > chop_knife) {
        this.knife_lctime = Phaser.Math.Wrap(time, 0, 5000);
        this.tw.play();
        this.chop.play();
      }
    }
  }

  // collide function for faucet and upGrade
  hitUpgrade(faucet, upgrade){
    this.faster_bullet = true;
    this.waterCount += 50;
    this.upgrade.disableBody(true,true);
  }

  hitUpgradeK(knife, upgradeK){
    this.bigger_knife = true
    this.upgradeK.disableBody(true,true)
  }

  // generate water bullets
  shoot_water() {
    var water_bullet = this.water_bullets.get();
    // ensure water_bullet is not null
    if (water_bullet && this.faster_bullet == false) {
      water_bullet.setAngle(180);
      water_bullet
        .enableBody(true, this.faucet.x, this.faucet.y, true, true)
        .setVelocityY(-900)
        .setDepth(1);
      this.water.play();
      this.waterCount -= 1;
    } else if (water_bullet && this.faster_bullet == true) {
        water_bullet.setAngle(180);
        water_bullet
          .enableBody(true, this.faucet.x, this.faucet.y, true, true)
          .setVelocityY(-1200)
          .setDepth(1);
          this.water.play();
          this.waterCount -= 1;
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
    this.waterCount += 1;
  }
  // water hit function for (chopped) eggs
  hit_enemy_egg_b(projectile, enemy) {
    enemy.disableBody(true, true);
    projectile.disableBody(true, true);
    this.increment_score(10);
    this.increment_count('egg');
    this.egg_in_pot('bottom');
    this.waterCount += 1;
  }

  // water hit function for (chopped) eggs
  hit_enemy_egg_t(projectile, enemy) {
    enemy.disableBody(true, true)
    projectile.disableBody(true, true);
    this.increment_score(10);
    this.increment_count('egg');
    this.egg_in_pot('top');
    this.waterCount += 1;
  }

  hit_enemy_ham_slice(projectile, enemy) {
    enemy.disableBody(true, true)
    projectile.disableBody(true, true);
    this.increment_score(10);
    this.increment_count('ham');
    this.ham_in_pot();
    this.waterCount += 1;
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
    this.hamC += 1;
    console.log(this.hamC);
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
        .enableBody(true, 1400 +200*Math.random()*this.rand_sign(), 240+70*Math.random()*this.rand_sign(), true, true)
        .setScale(0.3)
        .setDepth(1);
    }
  }

  egg_in_pot(type) {
    if (type == 'top') {
      var egg_single = this.egg_top_dead.get()
      if (egg_single) {
        egg_single
          .enableBody(true, 1400 + 200*Math.random()*this.rand_sign(), 240+70*Math.random()*this.rand_sign(), true, true)
          .setScale(0.3)
          .setDepth(1);
      }
    } else if (type == 'bottom') {
      var egg_single = this.egg_bottom_dead.get()
      if (egg_single) {
        egg_single
          .enableBody(true, 1400 + 200*Math.random()*this.rand_sign(), 240+70*Math.random()*this.rand_sign(), true, true)
          .setScale(0.3)
          .setDepth(1);
      }
    }
  }

  ham_in_pot() {
    var ham_single = this.ham_slice_dead.get();
    if (ham_single) {
      ham_single
        .enableBody(true, 1400 +200*Math.random()*this.rand_sign(), 240+70*Math.random()*this.rand_sign(), true, true)
        .setScale(0.3)
        .setDepth(1);
    }
  }

  // upgrade collision
  set_proj_collision_upgrade(upgrade, faucet){
    this.physics.add.overlap(
      this.faucet,
      this.upgrade,
      this.hitUpgrade,
      null,
      this
    );
  }

  set_proj_collision_upgradeK(upgradeK, knife){
    this.physics.add.overlap(
      this.knife,
      this.upgradeK,
      this.hitUpgradeK,
      null,
      this
    );
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

  // egg collision function
  set_proj_collision_ham_slice (proj_group, enemies) {
    proj_group.children.each(
      function (p) {
        if (p.active) {
          this.physics.add.overlap(
            p,
            enemies,
            this.hit_enemy_ham_slice,
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
  set_proj_collision_egg_w (enemies){
    enemies.children.each(
      function (e) {
        if (e.active) {
          if (e.x > this.cameras.main.width) {
            this.fires += 2;
            e.destroy();
          }
        }
      }.bind(this)
    );
  }

  set_proj_collision_ham_w (enemies){
    enemies.children.each(
      function (e) {
        if (e.active) {
          if (e.x > this.cameras.main.width) {
            this.fires += 4;
            e.destroy();
          } else if (this.hamC % 10 == 0) {
            e.disableBody(true, true);
            this.hamC = 1;
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

  checkKnifeColl(tweenData){//, hamGroup, hamSlices) {
    var hams = this.ham.getChildren();
    var ham_slices = this.ham_slice.getChildren();
    //console.log(hams);
    //console.log(ham_slices);
    for(var h of hams) {
      if (h) {
        var overlap = this.physics.world.overlap(h, this.knife);
        if (overlap) {
          //h.disableBody(true, true)
          this.spawn_ham(h.x, h.y, 'slice');

          //h.destroy()
        }
      }
    }
    for(h in ham_slices) {
      if (h) {
        var overlap = this.physics.world.overlap(h, this.knife);
        if (overlap) {
          //h.disableBody(true, true)
          spawn_ham(h.x, h.y, 'strip', h);
          //h.destroy()
        }
      }
    }
  }
}
