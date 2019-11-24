/*global Phaser*/
import * as ChangeScene from './ChangeScene.js';
export default class BootScene extends Phaser.Scene {
  constructor () {
    super('Boot');
  }

  init (data) {
    // Initialization code goes here

    //  Inject our CSS
    var element = document.createElement('style');
    document.head.appendChild(element);
    var sheet = element.sheet;
    var styles = '@font-face { font-family: "indie_flower"; src: url("assets/Font/IndieFlower.otf") format("opentype"); }\n';
    sheet.insertRule(styles, 0);

  }

  preload () {
    // Preload assets
    this.load.image('ui', './assets/UI/UI.png');

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;

    // 1.1 load sounds in both formats mp3 and ogg
    this.load.audio("background", ["assets/sounds/background.mp3"]);

    // load webfont
    this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
  }

  create (data) {
    //Add event listeners
    ChangeScene.addSceneEventListeners(this);

    //add music
    this.background_music = this.sound.add("background");
    var musicConfig = {
      mute: false,
      volume: 1,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: true,
      delay: 0
    }
    this.background_music.play(musicConfig);

    // Create the scene and add text
    var background = this.add.image(this.centerX, this.centerY, 'ui');

    // preload the font
    var add = this.add;
    var input = this.input;

    WebFont.load({
      custom: {
        families: [ 'indie_flower' ]
      },
      active: function ()
      {
        add.text(0, 0, '.', { fontFamily: 'indie_flower', fontSize: 1, color: '#ff0000' });
      }
    });

    // Add scoring keys to registry
    this.registry.set({level_1_hs: 0, level_2_hs: 0, level_3_hs: 0})
    }

  update (time, delta) {
    // Update the scene
  }
}
