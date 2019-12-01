/*global Phaser*/
import * as ChangeScene from './ChangeScene.js';
export default class PickLevel extends Phaser.Scene {
  constructor () {
    super('Pause4');
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
    this.load.image('knife', "./assets/player/knife.png");
    this.load.image('pot', "./assets/background/pot.png");
    this.load.image('upgrade', "./assets/UI/upGrade.png");
    this.load.image('upgradeK', "./assets/UI/upGradeK.png");

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

    //add music
    // this.background = this.sound.add("background");
    // var musicConfig = {
    //   mute: false,
    //   volume: 1,
    //   rate: 1,
    //   detune: 0,
    //   seek: 0,
    //   loop: true,
    //   delay: 0
    // }
    // this.background.play(musicConfig);

    //Create the scene and add text
    this.star1;
    this.star2;
    this.star3;
    this.clickboard = this.add.sprite(1920/2, 1080/2 , 'clickboard2').setScale(2).setDepth(1);

    this.resume = this.add.image(1600, 910, 'resume').setScale(1).setDepth(2).setInteractive();
    this.resume.on("pointerup",function(){
      this.scene.wake("Level4");
      this.scene.stop();
    }, this
    );
    this.targetingredients = this.add.text(350, 200, 'Target Ingredients', {fontFamily:'indie_flower', fontSize: '60px', fill: '#000000' }).setDepth(2);
    this.targetingredients = this.add.text(1240, 500, 'Power-ups', {fontFamily:'indie_flower', fontSize: '60px', fill: '#000000' }).setDepth(2);
    this.faucetP = this.physics.add.sprite(450, 400, 'faucet').setScale(0.3).setDepth(2);
    this.faucetP2 = this.physics.add.sprite(700, 600, 'faucet').setScale(0.3).setDepth(2);
    this.faucetP3 = this.physics.add.sprite(700, 800, 'faucet').setScale(0.3).setDepth(2);
    this.knifeP = this.physics.add.sprite(450, 600, 'knife').setScale(0.2).setDepth(2);
    this.knifeP2 = this.physics.add.sprite(450, 800, 'knife').setScale(0.2).setDepth(2);
    this.riceP = this.physics.add.sprite(300, 400, 'rice').setScale(0.6).setDepth(2);
    this.eggP = this.physics.add.sprite(300, 600, 'egg').setScale(0.5).setDepth(2);
    this.eggTP = this.physics.add.sprite(600, 560, 'egg_top').setScale(0.5).setDepth(2);
    this.eggBP = this.physics.add.sprite(600, 640, 'egg_bottom').setScale(0.5).setDepth(2);
    this.hamP = this.physics.add.sprite(300, 800, 'ham').setScale(0.2).setDepth(2);
    this.hamSP = this.physics.add.sprite(600, 800, 'ham_slice').setScale(0.5).setDepth(2);
    this.potP = this.physics.add.sprite(700, 400, 'pot').setScale(0.3).setDepth(2);
    this.potP2 = this.physics.add.sprite(900, 600, 'pot').setScale(0.3).setDepth(2);
    this.potP2 = this.physics.add.sprite(900, 800, 'pot').setScale(0.3).setDepth(2);
    this.credit = this.physics.add.sprite(1350, 300, 'credit').setScale(0.4).setDepth(2);
    this.UPP = this.physics.add.sprite(1250, 700, 'upgrade').setScale(0.3).setDepth(2);
    this.UPKP = this.physics.add.sprite(1500, 700, 'upgradeK').setScale(0.3).setDepth(2);

  }

  update (time, delta) {


  }

}
