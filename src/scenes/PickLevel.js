/*global Phaser*/
import * as ChangeScene from './ChangeScene.js';
export default class PickLevel extends Phaser.Scene {
  constructor () {
    super('PickLevel');
  }

  init (data) {
    // Initialization code goes here
    this.level = data.level
    this.star = data.star
  }

  preload () {
    // Preload assets
    this.load.image('pick', './assets/UI/level.png');
    this.load.image('soupT', './assets/UI/soupT.png');
    this.load.image('soup1', './assets/UI/soup1.png');
    this.load.image('soup2', './assets/UI/soup2.png');
    this.load.image('soup3', './assets/UI/soup3.png');
    this.load.image('star1', './assets/UI/star1.png');
    this.load.image('star2', './assets/UI/star2.png');
    this.load.image('star3', './assets/UI/star3.png');
    this.load.image('soupLock', './assets/UI/soupLock.png')


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
    var background = this.add.image(this.centerX, this.centerY, 'pick');
    this.star1;
    this.star2;
    this.star3;

    this.levelT = this.add.image(this.centerX, this.centerY, 'soupT').setScale(0.6).setInteractive();
    this.levelT.on("pointerup",function(){
      this.scene.start("LevelT");
    }, this
    );

    this.level1 = this.add.image(this.centerX-400, this.centerY+200, 'soup1').setScale(0.6).setInteractive();
    this.level1.on("pointerup",function(){
      this.scene.start("Level1");
    }, this
    );

    this.level2Lock = this.add.image(this.centerX, this.centerY+200, 'soupLock').setScale(0.6)//.setInteractive();

    this.level3Lock = this.add.image(this.centerX+400, this.centerY+200, 'soupLock').setScale(0.6)//.setInteractive();
  }

  update (time, delta) {
    // level lock until player gets a star on previous levels
    var level_2_unlock = this.registry.get('level_1_hs') > 0;
    var level_3_unlock = this.registry.get('level_1_hs') > 0 && this.registry.get('level_2_hs') > 0;

    if (level_2_unlock) {
      this.level2Lock.destroy()
      this.level2 = this.add.image(this.centerX, this.centerY+200, 'soup2').setScale(0.6).setInteractive()
      this.level2.on("pointerup",function(){
        this.scene.start("Level2");
      }, this
      );
    }
    if (level_3_unlock) {
      this.level3Lock.destroy()
      this.level3 = this.add.image(this.centerX+400, this.centerY+200, 'soup3').setScale(0.6).setInteractive()
      this.level3.on("pointerup",function(){
        this.scene.start("Level4");
      }, this
      );
    }

    // add stars
    switch(this.registry.get('level_1_hs')) {
      case 1: this.star1 = this.add.image(this.centerX-430, this.centerY+300, 'star1').setScale(0.2);
        break;
      case 2: this.star1 = this.add.image(this.centerX-430, this.centerY+300, 'star2').setScale(0.2);
        break;
      case 3:
        this.star1 = this.add.image(this.centerX-430, this.centerY+300, 'star3').setScale(0.2);
        break;
    }
    switch(this.registry.get('level_2_hs')) {
      case 1: this.star2 = this.add.image(this.centerX-35, this.centerY+300, 'star1').setScale(0.2);
        break;
      case 2: this.star2 = this.add.image(this.centerX-35, this.centerY+300, 'star2').setScale(0.2);
        break;
      case 3:
        this.star2 = this.add.image(this.centerX-35, this.centerY+300, 'star3').setScale(0.2);
        break;
    }
    switch(this.registry.get('level_3_hs')) {
      case 1: this.star3 = this.add.image(this.centerX+400, this.centerY+300, 'star1').setScale(0.2);
        break;
      case 2: this.star3 = this.add.image(this.centerX+400, this.centerY+300, 'star2').setScale(0.2);
        break;
      case 3:
        this.star3 = this.add.image(this.centerX+400, this.centerY+300, 'star3').setScale(0.2);
        break;
    }
  }

}
