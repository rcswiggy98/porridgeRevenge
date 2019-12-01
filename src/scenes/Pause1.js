/*global Phaser*/
import * as ChangeScene from './ChangeScene.js';
export default class PickLevel extends Phaser.Scene {
  constructor () {
    super('Pause1');
  }

  init (data) {
    // Initialization code goes here
    this.level = data.level
    this.star = data.star
  }

  preload () {
    // Preload assets
    this.load.image('pause', './assets/UI/pause.png');
    this.load.image('resume', './assets/UI/resume.png');
    this.load.image('credit', './assets/UI/credit.png');
    this.load.image('clickboard2', "./assets/background/clickboard2.png");
    this.load.image('faucet', "./assets/player/faucet.png");
    this.load.image('pot', "./assets/background/pot.png");

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
    this.load.spritesheet("ham", "./assets/enemy/pork.png", {
      frameHeight: 244,
      frameWidth: 713
    });
    this.load.spritesheet("ham_slice", "./assets/enemy/porkSlice.png", {
      frameHeight: 206,
      frameWidth: 153
    });

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;

    // 1.1 load sounds in both formats mp3 and ogg
    this.load.audio("background", ["assets/sounds/background.mp3"]);

  }

  create (data) {
    //Add event listeners
    ChangeScene.addSceneEventListeners(this);


    //Create the scene and add text
    this.star1;
    this.star2;
    this.star3;
    this.clickboard = this.add.sprite(1920/2, 1080/2 , 'clickboard2').setScale(2).setDepth(1);

    this.resume = this.add.image(1600, 910, 'resume').setScale(1).setDepth(2).setInteractive();
    this.resume.on("pointerup",function(){
      this.scene.wake("Level1");
      this.scene.stop();
    }, this
    );
    this.targetingredients = this.add.text(350, 200, 'Target Ingredients', {fontFamily:'indie_flower', fontSize: '60px', fill: '#000000' }).setDepth(2);
    this.faucetP = this.physics.add.sprite(450, 400, 'faucet').setScale(0.3).setDepth(2);
    this.riceP = this.physics.add.sprite(300, 400, 'rice').setScale(0.6).setDepth(2);
    this.potP = this.physics.add.sprite(700, 400, 'pot').setScale(0.3).setDepth(2);
    this.credit = this.physics.add.sprite(1350, 500, 'credit').setScale(0.6).setDepth(2);

  }

  update (time, delta) {


  }

}
