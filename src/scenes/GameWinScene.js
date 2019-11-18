/*global Phaser*/
import * as ChangeScene from './ChangeScene.js';
export default class GameWinScene extends Phaser.Scene {
  constructor () {
    super('GameWinScene');
  }

  init (data) {
    // Initialization code goes here
    this.total_count = data.total_count;
    this.enemy_total = data.enemy_total;
    this.level = data.level;
  }

  preload () {
    // Preload assets
    this.load.image('win', './assets/UI/win.png');
    this.load.image('star1', './assets/UI/star1.png');
    this.load.image('star2', './assets/UI/star2.png');
    this.load.image('star3', './assets/UI/star3.png');

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  create (data) {
    //Add event listeners
    ChangeScene.addSceneEventListeners(this);

    //Create the scene and add text
    var logo = this.add.image(this.centerX, this.centerY, 'win');
    var text = this.add.text(this.centerX-500, this.centerY+300, "Click on the star to main menu", {fontSize:60})

    if (this.total_count >= 0.9* this.enemy_total) {
      var star3 = this.add.image(this.centerX, this.centerY+150, 'star3').setScale(0.7).setInteractive();
      star3.on("pointerup",function(){
        switch (this.level) {
          // update high score in registry
          case 1: 
            if (this.registry.get('level_1_hs') < 3) this.registry.set({level_1_hs: 3}); 
            break;
          case 2: 
            if (this.registry.get('level_2_hs') < 3) this.registry.set({level_2_hs: 3}); 
            break; 
          case 3: 
            if (this.registry.get('level_3_hs') < 3) this.registry.set({level_3_hs: 3}); 
            break;
        }
        this.scene.start("PickLevel")//, {star:3, level:this.level});
      }, this);
    } else if (this.total_count >= 0.7* this.enemy_total) {
      var star2 = this.add.image(this.centerX, this.centerY+150, 'star2').setScale(0.7).setInteractive();
      star2.on("pointerup",function(){
        switch (this.level) {
          // update high score in registry
          case 1: 
            if (this.registry.get('level_1_hs') < 2) this.registry.set({level_1_hs: 2}); 
            break;
          case 2: 
            if (this.registry.get('level_2_hs') < 2) this.registry.set({level_2_hs: 2}); 
            break; 
          case 3: 
            if (this.registry.get('level_3_hs') < 2) this.registry.set({level_3_hs: 2}); 
            break;
        }
        this.scene.start("PickLevel")//, {star:2, level:this.level});
      }, this);
    } else {
      var star1 = this.add.image(this.centerX, this.centerY+150, 'star1').setScale(0.7).setInteractive();
      star1.on("pointerup",function(){
        switch (this.level) {
          // update high score in registry
          case 1: 
            if (this.registry.get('level_1_hs') < 1) this.registry.set({level_1_hs: 1}); 
            break;
          case 2: 
            if (this.registry.get('level_2_hs') < 1) this.registry.set({level_2_hs: 1}); 
            break; 
          case 3: 
            if (this.registry.get('level_3_hs') < 1) this.registry.set({level_3_hs: 1}); 
            break;
        }
        this.scene.start("PickLevel")//, {star:1, level:this.level});
      }, this);
    }


  }

  update (time, delta) {
    // Update the scene
  }
}
