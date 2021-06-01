class gamePlay extends Phaser.Scene {

    constructor() {
        super("gamePlay");
    }

    init(highscore) {
        this.highestScore = highscore; 
    }

    // Creates all objects for this gamePlay scene
    create() {
        this.background = this.add.tileSprite(0, 0, game.config.width, game.config.height, "bg-1"); // loadar "background" filen
        this.background.setOrigin(0, 0); // Pivot sets to top left corner
        this.background.setScrollFactor(0); // Locks the pictures so camera doesnt follow

        this.backMountain = this.add.tileSprite(0, 0, game.config.width, game.config.height, "bg-2"); // loadar "forest" filen framför "background"
        this.backMountain.setOrigin(0, 0); 
        this.backMountain.setScrollFactor(0); 

        this.frontMountain = this.add.tileSprite(0, 0, game.config.width, game.config.height, "bg-3"); // loadar "ground" filen med lägre height än bakre lagren
        this.frontMountain.setOrigin(0, 0); 
        this.frontMountain.setScrollFactor(0); 
        this.frontMountain.y = 60; // change of y-position of picture

        

        this.player = this.physics.add.sprite(300, 300, "tomatori"); // adding a player with tomato image
        
        
        this.cursors = this.input.keyboard.createCursorKeys(); //cursor object
        this.pauseKey = this.input.keyboard.addKey('P'); // pausekey
 
	    // Possible dupe, Find Inheritance so this don't
	    // get everywhere
	    this.fullScreenKey = this.input.keyboard.addKey('F');
	    this.fullScreenKey.on('down', function(){
		if (this.scale.isFullscreen){
			this.scale.stopFullscreen();
		} else {
			this.scale.startFullscreen();
		    }
	    }, this);


        // This section adds a graphic bar at the top with transp 0.5 
        var graphics = this.add.graphics();
        graphics.setDepth(1000);
        graphics.fillStyle(0x000000, 0.5);
        graphics.beginPath(); 
        graphics.moveTo(0, 0);
        graphics.lineTo(config.width, 0);
        graphics.lineTo(config.width, 40);
        graphics.lineTo(0, 40); 
        graphics.lineTo(0, 0);
	    graphics.setDepth(666);
        // close file and fill the shape
        graphics.closePath();
        graphics.fillPath();
       
        
        // Parent to all the pipes and active trigger for spawning new ones
        this.pipeGroup = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        
        //Dynamic game settings
        this.pipeWidth = 50;
        this.pipeHeight = 317;
        this.angleFactor = 0;
        this.speedFactor = 0.5;
        this.pipeSpace = 0;
        this.levelTracker = 1;
        this.timerActive = true;
        this.pipeActive = true;
        this.playerAlive = true;
        this.scoreTracker = 0;
        

        // Shows the players life
        this.lifeLabel = this.add.bitmapText(10, 5, "pixelFont", "TOMATO LIFE: " + userData.lifeTracker, 24); // TextFont for game info
        this.lifeLabel.setDepth(1000);

        // Shows which level
        this.levelLabel = this.add.bitmapText(200, 5, "pixelFont", "LEVEL: " + this.levelTracker, 24); // TextFont for game info
        this.levelLabel.setDepth(1000);

        // Shows players points
        this.scoreLabel = this.add.bitmapText(300, 5, "pixelFont", "POINTS: " + this.scoreTracker, 24); // TextFont for game info
        this.scoreLabel.setDepth(1000);

        // Shows highscore
        this.topLabel = this.add.bitmapText(450, 5, "pixelFont", "TOP SCORE: " + this.highestScore, 24); // TextFont for game info
        this.topLabel.setDepth(1000);

        // Detect if player collide with pipes
        this.physics.add.overlap(this.player, this.pipeGroup, this.hurtplayer, null, this);
	    this.music = this.sound.add('hype');
	    this.music.play();
	    this.music.setVolume(0.1);

        // Flag for pause
        this.game_paused = false;
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    // Functions to handle pause
    createPauseScreen() {

        this.shader = this.add.graphics(this);
        this.shader.fillStyle(0x9b9e99, 0.3);
        this.shader.fillRect(0, 0, 640, 640);
        this.shader.setDepth(1200);
       
        this.player.body.moves = false;
        this.pauseTxt = this.add.bitmapText(195, 220, "pixelFont", " P A U S E ", 48);
        this.game_paused = !this.game_paused;
        this.music.stop();

        this.exitButton = this.add.image(320,400,"exit").setScale(2).setDepth(10);
		    this.exitButton 	
		    .setInteractive()
		    .on("pointerdown", () => {

          async function resetTomato(value) {
            const points = await userData.incrementPom(value);  
          }
          resetTomato(userData.lifeTracker);
          userData.lifeTracker = 0;
          this.scene.start('gameOver', this.highestScore);
		    });

        this.arrow = this.physics.add.sprite(config.width/2 - 85, config.height/2+80, 'arrow');
		    this.arrow.body.setAllowGravity(false);
		    
        

    }

    resumGame() {
        this.game_paused = !this.game_paused;
        this.player.body.moves = true;
        this.pauseTxt.destroy();
        this.shader.destroy();
        this.arrow.destroy();
        this.exitButton.destroy();
        this.music.play();
        
    }



    // Here is the rendering part which is a loop
    update() {

      
        this.pauseKey.addListener('down', function(){
			if (!this.game_paused){
				this.createPauseScreen();
			} else {
				this.resumGame()
			}
		}, this);


        if(!this.game_paused)  {
        this.movePlayer();

        this.tileBackgrounds();

        this.runPipes();
        
        
        if(this.timerActive === true) {

            this.time.addEvent({
                delay: 10000, //ms
                callback: this.updateDifficulty,
                callbackScope: this,
                loop: false
          });
          this.timerActive = false;
            }   
        }

      if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
			
        async function resetTomato(value) {
            const points = await userData.incrementPom(value);  
          }
          resetTomato(userData.lifeTracker);
          userData.lifeTracker = 0;
          this.scene.start('gameOver', this.highestScore);
		  } 
     
     
    } 

    // function to have a moving background and objects
    tileBackgrounds() {
     	
	this.backMountain.tilePositionX += 0.1;
        this.frontMountain.tilePositionX += 0.5; 
    }

    movePlayer() {

        if (this.cursors.down.isDown) { 
            this.player.setVelocityY(160);
            this.player.anims.play("fly"); }
        
        else if (this.cursors.up.isDown) { 
            this.player.setVelocityY(-140); 
            this.player.anims.play("fly");} 
        
        else if (this.cursors.left.isDown) { 
            this.player.setVelocityX(-55); 
            this.player.anims.play("fly");}
        
        else if (this.cursors.right.isDown) { 
            this.player.setVelocityX(55); 
            this.player.anims.play("fly");}

        
        if(this.player.y >= 630) {
            this.hurtplayer(this.player);
        }

    }
    
    runPipes() {

        this.spawnPipes();

        
        for(var i = 0; i < this.pipeGroup.getChildren().length; i++){
            var pipe = this.pipeGroup.getChildren()[i];
            pipe.x -= this.speedFactor
          }
        
        // Need better solution for trigger of spawnPipes() here
        var last =  this.pipeGroup.getChildren()[this.pipeGroup.getChildren().length-1];
        if(last.x < 150 + Phaser.Math.Between(0, config.width/2))
        this.pipeActive = true;

        // check if pipes need to be destroyed
        for(var i = 0; i < this.pipeGroup.getChildren().length; i++){
            var pipe = this.pipeGroup.getChildren()[i];
            pipe.update();
          }
          
        
    }
 
    spawnPipes() {

        // Simple trigger event to spawn new pipes
        if(this.pipeActive === true) {


            // Randomizing the height of the pipes
            var randomHeight = Phaser.Math.Between(100, 400);
            var randomColor = Phaser.Math.Between(0,1);
            var pipeUp = new pipeObject(this, "up", randomHeight, randomColor);
            pipeUp.displayHeight = randomHeight;

            var pipeDownSize = 250 + this.pipeSpace + (250 + this.pipeSpace - randomHeight); // Adjust pipeDown to have a 140px starting space between pipes and that will shrink
            var pipeDown = new pipeObject(this, "down", pipeDownSize, randomColor); 
            pipeDown.displayHeight = pipeDownSize

            // Randomizing the angle of the pipes that is dependent of the angleFactor
            var randomAngle = Phaser.Math.Between(-1,1) * this.angleFactor;
            var randomPick = Phaser.Math.Between(0,2);
            switch(randomPick) {

                case 0:
                    pipeUp.angle = Phaser.Math.Between(randomAngle, 0);
                    break;

                case 1:
                    pipeDown.angle = Phaser.Math.Between(randomAngle, 0);
                    break;
                
                case 2:
                    pipeUp.angle = Phaser.Math.Between(randomAngle, 0);
                    pipeDown.angle = pipeUp.angle;
                    break; 


            }
            
            this.pipeActive = false;
        }
        if(this.playerAlive === true) {
            this.scoreTracker += this.levelTracker * 1;
            this.scoreLabel.text = "SCORE: " + this.scoreTracker;
        }
        
    }

    // Function to play remove player and animate an explosion then reload game
    hurtplayer(player) {
        
        this.playerAlive = false;
        var explosion = new Explosion(this, player.x, player.y);
        player.disableBody(true, true);
	    this.music.stop();
        
        this.time.addEvent({
            delay: 2000, //ms
            callback: this.resetGame,
            callbackScope: this,
            loop: false
      });   

    }



    // Resets the game either by reloading current game or game over 
    resetGame() {
	
	// Change so that it reads user data from cookies
       	
	userData.lifeTracker -= 1;
	this.lifeLabel.text = "TOMATO LIFE: " + userData.lifeTracker;
        
        if(userData.lifeTracker > 0) {

            if(this.highestScore < this.scoreTracker) {
                this.highestScore = this.scoreTracker;
                this.topLabel.text = "TOP SCORE: " + this.highestScore;
            }
            this.scene.restart(this.highestScore);
        }
        else {
          if(this.highestScore < this.scoreTracker) 
                this.highestScore = this.scoreTracker;
        
            this.scene.start('gameOver', this.highestScore);
        }
    }

    // Dynamic change of difficulty
    updateDifficulty() {

        this.levelTracker += 1;
        this.speedFactor += 0.20;
        if(this.angleFactor < 31){
            this.angleFactor += 6;
        }
        this.pipeSpace += 10;
        this.timerActive = true;
        this.levelLabel.text = "LEVEL: " + this.levelTracker;
    }

}
