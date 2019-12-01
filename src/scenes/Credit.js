/*global Phaser*/
import * as ChangeScene from './ChangeScene.js';
export default class PickLevel extends Phaser.Scene {
  constructor () {
    super('Credit');
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
    this.load.image('clickboard2', "./assets/background/clickboard2.png");

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
      this.scene.wake("PickLevel");
      this.scene.stop();
    }, this
    );

  }

  update (time, delta) {


  }

}
