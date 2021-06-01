/*
 *	Boot Scene
 *	Responsible for loading bare minimum amount of assets to make loading
 *	scene works.
 *	
 *	Additional Cookies reading is implemented here.
 *	Goal:
 *		- During bootScene, fetch user cookies.
 *			(Who is it :thinkingemoji:)
 *		- API for rest of the scenes to access the cookies data
 *			Either pass it to next scene or create a class around it
 *		- Splitting and Processing of the Cookies
 *			For class or function prototype
 */ 

class bootGame extends Phaser.Scene {

	constructor() {
		super("bootGame");
	}
	preload() {
		// Load Font for Labels
		this.load.bitmapFont("pixelFont", "assets/font/click_0.png", "assets/font/click.xml");
		
		// Load Background 
        	this.load.image("bg-1", "assets/BG_DesertMountains/background1.png");
        	this.load.image("bg-2", "assets/BG_DesertMountains/background2.png");
        	this.load.image("bg-3", "assets/BG_DesertMountains/background3.png");
	
	}

	create(){
		this.scene.start('loadGame');
	}

}
