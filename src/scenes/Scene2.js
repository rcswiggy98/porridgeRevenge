/*global Phaser*/
import * as ChangeScene from './ChangeScene.js';
export default class BootScene extends Phaser.Scene {
  constructor () {
    super('Scene2');
  }

  init (data) {
    // Initialization code goes here
  }

  preload () {
    // Preload assets
    this.load.image('base', './assets/sprites/tankBase.png');
    this.load.image('turret', './assets/sprites/tankTurret.png');
    this.load.image('bullet', './assets/sprites/bullet.png');
    this.load.image('soda', './assets/sprites/soda.png');


    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  create (data) {
    //Create the scene
    ChangeScene.addSceneEventListeners(this);

    //Create the scene
    this.cameras.main.setBackgroundColor(0x008080);

    //Declare vars
    var turret, bullets, enemy, bullet, enemyGroup;
    //Global vars
    this.nextFire = 0;
    this.fireRate = 200;
    this.speed = 1000;

    //Add tank base
    var base = this.add.sprite(this.centerX, this.centerY, 'base');
    base.setScale(3);

    //Add turret
    this.turret = this.add.sprite(this.centerX, this.centerY, 'turret');
    this.turret.setScale(3);

    //Add bullet group w/ 10 bullets max
    this.bullets = this.physics.add.group({
      defaultKey: "bullet", 
      maxSize: 10
    });

    //Automate adding multipe enemies to a group
    this.enemyGroup = this.physics.add.group({
      key: "soda",
      repeat: 4,
      setXY: {
        x: 100,
        y: 100,
        stepX: 0,
        stepY: 100
      }
    });

    this.enemyGroup.children.iterate(function(child) {
      child.setScale(0.1);
    });

    //create supah can
    this.bigOne = this.physics.add.sprite(700, 300, 'soda');
    this.bigOne.flipX = true;
    this.bigOne.setScale(0.5);
    this.enemyGroup.add(this.bigOne);

    //Add event listener for movement of mouse pointer
    this.input.on(
      "pointermove",
      function(pointer) {
        var betweenPoints = Phaser.Math.Angle.BetweenPoints;
        var angle = Phaser.Math.RAD_TO_DEG * 
        betweenPoints(this.turret, pointer);
        this.turret.setAngle(angle);
      }, this
    );
    //when pointer is down, run function shoot
    this.input.on("pointerdown", this.shoot, this);
  }

  update (time, delta) {
    // Update the scene
    this.bullets.children.each(
      function (b) {
        if (b.active) {
          this.physics.add.overlap(
            b,
            this.enemyGroup,
            this.hitEnemy,
            null,
            this
          );
          if (b.y < 0) {
            b.setActive(false);
          } else if (b.y > this.cameras.main.height) {
            b.setActive(false);
          } else if (b.x < 0) {
            b.setActive(false);
          } else if (b.x > this.cameras.main.width) {
            b.setActive(false);
          }
        }
      }.bind(this)
    );
  }

  shoot (pointer) {
    var betweenPoints = Phaser.Math.Angle.BetweenPoints;
    var angle = betweenPoints(this.turret, pointer);
    var velocityFromRotation = this.physics.velocityFromRotation;
    //Create velocity vector
    var velocity = new Phaser.Math.Vector2();
    velocityFromRotation(angle, this.speed, velocity);
    // get bullet group
    var bullet = this.bullets.get();
    bullet.setAngle(Phaser.Math.RAD_TO_DEG * angle);
    bullet
      .enableBody(true, this.turret.x, this.turret.y, true, true)
      .setVelocity(velocity.x, velocity.y);
  }

  hitEnemy(bullet, enemy) {
    console.log('hit');
    enemy.disableBody(true, true);
    bullet.disableBody(true, true);
  }
}
