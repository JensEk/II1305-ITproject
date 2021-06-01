
// Global Variable referring to the parsed Cookie data of user
// Currently contains placeholder ID and tomato life
var userData = new cookieHandler();

var config = {
    width: 640,
    height: 640,
    backgroundColor: 0x000000,
    scene: [bootGame,loadGame, menuGame, gamePlay, gameOver], // de scener som ska vara med
    pixelArt: true,
    
    physics: {
        default: "arcade", // lightweight physics enabled
        arcade: {
            gravity: { y: 200 },
            debug: false,
            debugShowVelocity: false
        
        }
    },
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.Center_BOTH,
		width: 640,
		height: 640
	}
}

var game = new Phaser.Game(config);
