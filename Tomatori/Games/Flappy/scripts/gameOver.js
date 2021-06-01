// Scene for gameOver , reloads "loadGame"

class gameOver extends Phaser.Scene {

	constructor() {
		super("gameOver");
	}


	init(highscore) {
		this.leaderboard = highscore;
	}

	create() {
       	
		// Render Background
		this.bg = this.add.tileSprite(0, 0, game.config.width, game.config.height, "bg-1"); 
		this.bg.setOrigin(0, 0); 
        
		this.bm = this.add.tileSprite(0, 0, game.config.width, game.config.height, "bg-2"); 
		this.bm.setOrigin(0, 0); 

		this.fm = this.add.tileSprite(0, 0, game.config.width, game.config.height, "bg-3"); 
		this.fm.setOrigin(0, 0); 
		this.fm.y = 60; 
	
		// Render Game Over picture
		this.go = this.add.image (10, 50, "game_over"); 
		this.go.setOrigin(0, 0);
		this.go.setDepth(2);	

		// Render High Score
		this.leaderLabel = this.add.bitmapText(190, 305, "pixelFont", "YOUR SCORE " + this.leaderboard, 40);
		this.leaderLabel.setDepth(2);
       	
		// Play Game Over sound effect once
		this.music = this.sound.add('gameover');
		this.music.play();
		this.music.setVolume(0.3);
	
		this.timerActive = true;

		var userTomatos = 2; // Här måste något ändras !!!!!!!
		// Currently Placeholder func, change once SQL section is completed
		if(userTomatos > 0) {
			this.playButton = this.add.image(320,400,"play").setScale(2).setDepth(10);
			this.playButton
			.setInteractive()
			.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
				this.music.stop();
				this.scene.start("menuGame"); // Change where to load later
        // Upload HighScore to database here
			});
		}

		this.exitButton = this.add.image(320,400,"exit").setScale(2).setDepth(10);
		this.exitButton
		.setInteractive()
		.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
			
      async function putHighscore(value) {
            const highscore = await userData.highScore(value);  
          }
      putHighscore(this.leaderboard);
      
      this.music.stop();
			this.scene.start("menuGame"); // Change where to load later
      
		});

		// Enabling a arrow to choice with 
		this.arrow = this.physics.add.sprite(config.width/2 - 85, config.height/2+80, 'arrow');
		this.arrow.body.setAllowGravity(false);
		this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        

       	// Epic Tomato Bouncing, Depth set to 0 so it don't cover UI 
		this.tomatoes = this.physics.add.group();
		for (var i = 0; i <= 10; i++) {
			var randomTomato = Phaser.Math.Between(0,2);
			switch(randomTomato) {
				case 0:	
				var tomato = this.physics.add.sprite(16, 16, "cloud1").setScale(0.25);
				break;

				case 1:
				var tomato = this.physics.add.sprite(16, 16, "cloud2").setScale(0.25);
				break;

				case 2:
				var tomato = this.physics.add.sprite(16, 16, "cloud3").setScale(0.25);
				break;
			}

		this.tomatoes.add(tomato);
			

		tomato.setRandomPosition(0, 0, game.config.width, game.config.height);
		tomato.setVelocity(100, 100);
		tomato.setCollideWorldBounds(true);
		tomato.setBounce(1);
		}
	// Group Depth Setting
	this.tomatoes.setDepth(0);
	}

	update() {
		
		if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
      
      
      async function putHighscore(value) {
            const highscore = await userData.highScore(value);  
          }
      putHighscore(this.leaderboard);
			this.music.stop();
			this.scene.start("menuGame");
      // Upload HighScore to database here
		}
		
	}
}
