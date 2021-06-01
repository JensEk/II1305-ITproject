class bootGame extends Phaser.Scene{
	constructor(){
		super("bootGame");	
	}
	preload(){
		this.load.bitmapFont("pixelFont","assets/font/click_0.png","assets/font/click.xml");
		this.load.image("background","assets/backgrounds/Space_Stars2.png");
		this.load.image("sky2","assets/sky2.png");
	}
	create(){
		this.scene.start("loadGame");
	}

}
