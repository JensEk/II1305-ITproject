class lootGame extends Phaser.Scene{
	constructor(){
		super("lootGame");	
	}

	init(bag) {
		
		if(bag.length > 0) {
			this.bagholder = bag;
			this.pointer = bag.length;
		}
		else {
			this.bagholder = [];
			this.pointer = 1;
		}
			
	}

	create() {

		this.background = this.add.tileSprite(0,0,config.width,config.height,"background").setScale(2);
		this.planets = this.add.group();

		this.anims.create({
			key: 'box',
			frames: this.anims.generateFrameNumbers('planetbox'),
			frameRate: 15,
			repeat: -1
		});

		
		// Keep track where to replace planet when loot
		this.replace;

		// Keeps tracks of what planet is highlighted to be switched
		this.picked = false
		
		
		// Just a starter sprite
		this.planet = this.physics.add.sprite(config.width/2, config.height/2-100, "wet_1").setScale(2);
		this.planet.body.allowGravity = false
		this.planet.alpha = 0.5



		// Click to start rolling 
		this.rollButton = this.add.image(config.width/2-25, config.height/2 + 100, "roll_button")
		.setScale(1.25)
		.setInteractive()
		.on("pointerdown", () => {

			this.running = false
			this.planet.alpha = 1
			this.planet.anims.play("box");

		
		});

		// Click to stop scrolling and start looting
		this.lootButton = this.add.image(config.width/2+25, config.height/2 + 100, "loot_button")
		.setScale(1.25)
		.setInteractive()
		.on("pointerdown", () => {
			
			if(!this.running) {
				this.lootProgress = true;
				this.text;
				this.graphics;
				this.hsv;
				this.text = this.add.text(40, config.height/2+50);
				this.hsv = Phaser.Display.Color.HSVColorWheel();
				this.graphics = this.add.graphics({ x: 180, y: config.height/2+54 });

			this.timerEvents =	this.time.addEvent({
				delay: 1500, //ms
				callback: this.loot,
				callbackScope: this,
				loop: false
		  });
			}
			

		  
		});

		// Finish looting and go to menugames with the updated bag
		this.homeButton = this.add.image(590, 590, "build")
		.setScale(4)
		.setInteractive()
		.on("pointerdown", () => {

			
			this.scene.start("menuGame", this.bagholder);

		
		});

		// Update with existing planets
		for(let i = 1; i <= this.bagholder.length; i++) {
			this.spawnOld(i)
		}

		
	
	}

	
	// Handles all the looting aspects
	loot() {

		
		this.planet.anims.stop()
		this.lootProgress = false;
		this.running = true;
		this.text.destroy();
		this.graphics.destroy();

		this.lootButton.alpha = 0.25
		this.rollButton.alpha = 0.25

		
		// Adding texture box
		this.graphics = this.add.graphics();
        this.graphics.fillStyle(0x000000, 0.5); 
        this.graphics.beginPath(); 
        this.graphics.moveTo(100, 450);
        this.graphics.lineTo(config.width-100, 450);
        this.graphics.lineTo(config.width-100, 600);
        this.graphics.lineTo(100, 600); 
        this.graphics.lineTo(100, 450);
        this.graphics.closePath();
        this.graphics.fillPath();

		// Random planet stats
		this.food = Phaser.Math.Between(5,100)
		this.minerals = Phaser.Math.Between(5,100)
		this.energy = Phaser.Math.Between(5,100)

		this.foodLabel = this.add.bitmapText(110, 460, "pixelFont", "F O O D :  " + this.food, 14);
		this.mineralsLabel = this.add.bitmapText(110, 490, "pixelFont", "M I N E R A L S : " + this.minerals, 14);
		this.energyLabel = this.add.bitmapText(110, 520, "pixelFont", "E N E R G Y : " + this.energy, 14);
		this.scoreLabel = this.add.bitmapText(110, 550, "pixelFont", "S C O R E : " + (this.food+this.minerals+this.energy), 14);

		// Keep planet button
		this.yesButton = this.add.image(config.width/2-25, 525, "loot_yes")
		.setScale(3.5)
		.setInteractive()
		.on("pointerdown", () => {

			this.destroyAll();
			// Save data about our planet here
			var number = Math.floor((this.planet.frame.name / 5) + 1)

			if(this.bagholder.length < 5) {

				if(this.replace < this.pointer)
					this.replacePlanet()
				
				this.replace = null;
				this.spawnChoosen(this.pointer,this.food,this.minerals,this.energy, number)
				this.pointer = this.bagholder.length + 1
				
			}
			else {
				this.bagholder[this.replace-1] = number
				this.replacePlanet()
				this.spawnChoosen(this.replace,this.food,this.minerals,this.energy, number)
			}
			
		
		});

		// Discard button 
		this.discardButton = this.add.image(config.width/2+100, 525, "loot_no")
		.setScale(3.5)
		.setInteractive()
		.on("pointerdown", () => {

			this.destroyAll();
			// Return some points and let player reloot
			
		
		});

	}

	replacePlanet() {

		this.picked = false;

		switch(this.replace) {
			case 1:
				this.planet1.destroy()
				this.pointer = 1
				break;
			case 2:
				this.planet2.destroy()
				this.pointer = 2
				break;
			case 3:
				this.planet3.destroy()
				this.pointer = 3
				break;
			case 4:
				this.planet4.destroy()
				this.pointer = 4
				break;
			case 5:
				this.planet5.destroy()
				this.pointer = 5
				break;
		}

	}

	// When we loot a new planet
	spawnChoosen(position,food,minerals,energy, type) {

		switch(position) {
			
			case 1:
				this.planet1Stat = new planet(food,minerals,energy, type)
				this.bagholder[position-1] = this.planet1Stat
				this.planet1 = this.add.sprite(570, 75, `planet${this.bagholder[0].type}`).setScale(0.5)
				.setInteractive()
				.on("pointerdown", () => { 
					if(!this.picked) {
						this.replace = 1; this.planet1.alpha = 0.5; this.picked = true }
					} );
				break;
			case 2:
				this.planet2Stat = new planet(food,minerals,energy, type)
				this.bagholder[position-1] = this.planet2Stat
				this.planet2 = this.add.sprite(570, 150, `planet${this.bagholder[1].type}`).setScale(0.5)
				.setInteractive()
				.on("pointerdown", () => { 
					if(!this.picked) {
					this.replace = 2; this.planet2.alpha = 0.5; this.picked = true } } );
				break;
			case 3:
				this.planet3Stat = new planet(food,minerals,energy, type)
				this.bagholder[position-1] = this.planet3Stat
				this.planet3 = this.add.sprite(570, 225, `planet${this.bagholder[2].type}`).setScale(0.5)
				.setInteractive()
				.on("pointerdown", () => { 
					if(!this.picked) {
					this.replace = 3; this.planet3.alpha = 0.5; this.picked = true }} );
				break;
			case 4:
				this.planet4Stat = new planet(food,minerals,energy, type)
				this.bagholder[position-1] = this.planet4Stat
				this.planet4 = this.add.sprite(570, 300, `planet${this.bagholder[3].type}`).setScale(0.5)
				.setInteractive()
				.on("pointerdown", () => { 
					if(!this.picked) {
					this.replace = 4; this.planet4.alpha = 0.5; this.picked = true } });
				break;
			case 5:
				this.planet5Stat = new planet(food,minerals,energy, type)
				this.bagholder[position-1] = this.planet5Stat
				this.planet5 = this.add.sprite(570, 375, `planet${this.bagholder[4].type}`).setScale(0.5)
				.setInteractive()
				.on("pointerdown", () => { 
					if(!this.picked) {
					this.replace = 5; this.planet5.alpha = 0.5; this.picked = true }} );
				break;
		}

	}

	// Used to print the planets that exists in our bag
	spawnOld(position) {

		switch(position) {

			case 1:
				this.planet1 = this.add.sprite(570, 75, `planet${this.bagholder[0].type}`).setScale(0.5)
				.setInteractive()
				.on("pointerdown", () => { 
					if(!this.picked) {
						this.replace = 1; this.planet1.alpha = 0.5; this.picked = true }})
				break;
			case 2:
				this.planet2 = this.add.sprite(570, 150, `planet${this.bagholder[1].type}`).setScale(0.5)
				.setInteractive()
				.on("pointerdown", () => { 
					if(!this.picked) {
						this.replace = 2; this.planet2.alpha = 0.5; this.picked = true } } );
				break;
			case 3:
				this.planet3 = this.add.sprite(570, 225, `planet${this.bagholder[2].type}`).setScale(0.5)
				.setInteractive()
				.on("pointerdown", () => { 
					if(!this.picked) {
						this.replace = 3; this.planet3.alpha = 0.5; this.picked = true }} );
				break;
			case 4:
				this.planet4 = this.add.sprite(570, 300, `planet${this.bagholder[3].type}`).setScale(0.5)
				.setInteractive()
				.on("pointerdown", () => { 
					if(!this.picked) {
						this.replace = 4; this.planet4.alpha = 0.5; this.picked = true } });
				break;
			case 5:
				this.planet5 = this.add.sprite(570, 375, `planet${this.bagholder[4].type}`).setScale(0.5)
				.setInteractive()
				.on("pointerdown", () => { 
					if(!this.picked) {
						this.replace = 5; this.planet5.alpha = 0.5; this.picked = true }} );
				break;
		}
	}

	


	

	

	destroyAll () {

			this.foodLabel.destroy() 
			this.mineralsLabel.destroy()
			this.energyLabel.destroy()
			this.scoreLabel.destroy() 
			this.yesButton.destroy() 
			this.discardButton.destroy()
			this.graphics.destroy()

			this.lootButton.alpha = 1
			this.rollButton.alpha = 1
	}

	

	update() {
		

		if(this.lootProgress) {

		this.graphics.clear();
        this.graphics.fillStyle(this.hsv[8 * 8].color, 1);
        this.graphics.fillRect(0, 0, 400 * this.timerEvents.getProgress(), 8);
    	this.text.setText('Looting:' + this.timerEvents.getProgress().toString().substr(0, 4));
		}
		
		
		this.background.tilePositionX += 0.1;
			
		

    }

}

// Creates a planet object for each looted 
class planet {
	constructor(food, minerals, energy, type) {
		this.food = food
		this.mineral = minerals
		this.energy = energy
		this.score = food + minerals + energy
		this.type = type

	}

}

