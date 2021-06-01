class possibleUse extends Phaser.Scene{
	
	create() {

		this.background = this.add.tileSprite(0, 0, game.config.width, game.config.height, "sky2");
		this.background.setOrigin(0, 0);

		let planet1X = 100, planet1Y = 200
		let planet2X = 300, planet2Y = 150
		let planet3X = 100, planet3Y = 200
		let planet4X = 100, planet4Y = 200
		let planet5X = 100, planet5Y = 200

		this.anims.create({
			key: 'rock1',
			frames: this.anims.generateFrameNumbers('rock_1'),
			frameRate: 10,
			repeat: -1
		});

		this.anims.create({
			key: 'lava1',
			frames: this.anims.generateFrameNumbers('lava_1'),
			frameRate: 10,
			repeat: -1
		});

		this.anims.create({
			key: 'dry1',
			frames: this.anims.generateFrameNumbers('dry_1'),
			frameRate: 10,
			repeat: -1
		});

		this.anims.create({
			key: 'wet1',
			frames: this.anims.generateFrameNumbers('wet_1'),
			frameRate: 10,
			repeat: -1
		});

		this.anims.create({
			key: 'last1',
			frames: this.anims.generateFrameNumbers('last_1'),
			frameRate: 10,
			repeat: -1
		});
		this.planet1 = this.physics.add.sprite(90, 300, "rock_1"); 
        this.planet1.body.setAllowGravity(false);
		this.planet1.angle = 45 
		this.planet1.anims.play("rock1");

		this.planet2 = this.physics.add.sprite(335, 275, "lava_1").setScale(1.25); 
        this.planet2.body.setAllowGravity(false);
		this.planet2.angle = 25 
		this.planet2.anims.play("lava1");

		this.planet3 = this.physics.add.sprite(340, 450, "dry_1").setScale(0.9); 
        this.planet3.body.setAllowGravity(false);
		this.planet3.angle = 35 
		this.planet3.anims.play("dry1");

		this.planet4 = this.physics.add.sprite(135, 500, "wet_1").setScale(1.35); 
        this.planet4.body.setAllowGravity(false);
		this.planet4.angle = 10 
		this.planet4.anims.play("wet1");

	}

	update() {
		
       // this.background.tilePositionX += 0.5;
		

    }