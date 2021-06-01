class Explosion extends Phaser.GameObjects.Sprite{
  
    // Creates an explosion animation to the parent scene
    constructor(scene,x,y){
      super(scene, x, y, "explosion");
      scene.add.existing(this);
      this.play("explode");
    }
  }
  