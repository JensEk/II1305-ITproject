class loadGame extends Phaser.Scene{
	constructor(){
		super("loadGame");	
	}
	preload(){
		// Load Loading Screen stuff 
		this.createLoadingStat();

		// Load Planets as tilesheet that can be animated
		// File are 600x500 where each sprite is 100x100
		// so animation can run on 30 fps
		this.load.spritesheet('wet_1','assets/wet_1.png',{
			frameWidth: 100,
			frameHeight: 100,
		});
		this.load.spritesheet('wet_2','assets/wet_2.png',{
			frameWidth: 100,
			frameHeight: 100,
		});
		this.load.spritesheet('dry_1','assets/dry_1.png',{
			frameWidth: 100,
			frameHeight: 100,
		});
		this.load.spritesheet('dry_2','assets/dry_2.png',{
			frameWidth: 100,
			frameHeight: 100,
		});
		this.load.spritesheet('lava_1','assets/lava_1.png',{
			frameWidth: 100,
			frameHeight: 100,
		});
		this.load.spritesheet('lava_2','assets/lava_2.png',{
			frameWidth: 100,
			frameHeight: 100,
		});
		this.load.spritesheet('lava_3','assets/lava_3.png',{
			frameWidth: 100,
			frameHeight: 100,
		});
		this.load.spritesheet('rock_1','assets/rock_1.png',{
			frameWidth: 100,
			frameHeight: 100,
		
		});
		// Lootscene 
		this.load.spritesheet('planetbox','assets/planets.png',{
			frameWidth: 100,
			frameHeight: 100,
		
		});

		this.load.spritesheet('planet1','assets/planet1.png',{
			frameWidth: 100,
			frameHeight: 100,
		
		});
		this.load.spritesheet('planet2','assets/planet2.png',{
			frameWidth: 100,
			frameHeight: 100,
		
		});
		this.load.spritesheet('planet3','assets/planet3.png',{
			frameWidth: 100,
			frameHeight: 100,
		
		});
		this.load.spritesheet('planet4','assets/planet4.png',{
			frameWidth: 100,
			frameHeight: 100,
		
		});
		this.load.spritesheet('planet5','assets/planet5.png',{
			frameWidth: 100,
			frameHeight: 100,
		
		});
		this.load.spritesheet('planet6','assets/planet6.png',{
			frameWidth: 100,
			frameHeight: 100,
		
		});
		this.load.spritesheet('planet7','assets/planet7.png',{
			frameWidth: 100,
			frameHeight: 100,
		
		});
		this.load.spritesheet('planet8','assets/planet8.png',{
			frameWidth: 100,
			frameHeight: 100,
		
		});
		this.load.spritesheet('planet9','assets/planet9.png',{
			frameWidth: 100,
			frameHeight: 100,
		
		});
		this.load.spritesheet('planet10','assets/planet10.png',{
			frameWidth: 100,
			frameHeight: 100,
		
		});
		this.load.spritesheet('planet11','assets/planet11.png',{
			frameWidth: 100,
			frameHeight: 100,
		
		});
		this.load.spritesheet('planet12','assets/planet12.png',{
			frameWidth: 100,
			frameHeight: 100,
		
		});
		
		// Loading Existing Play Buttons
		this.load.image('play_button','assets/play.png');
		this.load.image('options_button','assets/options.png');
		this.load.image('pause_button','assets/pause.png');
		this.load.image('exit_button','assets/exit.png');

		// Lootscene buttons
		this.load.image('roll_button','assets/buttons_idle/Idle48.png');
		this.load.image('loot_button','assets/buttons_idle/Idle33.png');
		this.load.image('loot_yes','assets/buttons_idle/Idle3.png');
		this.load.image('loot_no','assets/buttons_idle/Idle2.png');
	
		// Load Arrows 
		this.load.image('arrow','assets/arrow.png');
		// Load Buttons needed
		this.load.image('arrowbtn_down','assets/buttons_idle/Idle12.png');
		this.load.image('arrowbtn_up','assets/buttons_idle/Idle15.png');
		this.load.image('build','assets/buttons_idle/Idle38.png');
		this.load.image('open_lootbox','assets/buttons_idle/Idle47.png');
		// Feel Free add more buttons in buttons_idle folder here
		// I'll leave it empty for now so you can import it when
		// you needed any of them
		this.load.image('food','assets/food.png');
		
		this.load.audio('menuTheme','assets/moontheme.ogg');
		this.load.audio('gameover', 'assets/gameover.mp3');
	}

	// Creates all the anims for each of the 12 planets
	create() {
		this.anims.create({
			key: "p1",
			frames: this.anims.generateFrameNumbers(`planet1`),
			frameRate: 10,
			repeat: -1
		});
		this.anims.create({
			key: "p2",
			frames: this.anims.generateFrameNumbers(`planet2`),
			frameRate: 10,
			repeat: -1
		});
		this.anims.create({
			key: "p3",
			frames: this.anims.generateFrameNumbers(`planet3`),
			frameRate: 10,
			repeat: -1
		});
		this.anims.create({
			key: "p4",
			frames: this.anims.generateFrameNumbers(`planet4`),
			frameRate: 10,
			repeat: -1
		});
		this.anims.create({
			key: "p5",
			frames: this.anims.generateFrameNumbers(`planet5`),
			frameRate: 10,
			repeat: -1
		});
		this.anims.create({
			key: "p6",
			frames: this.anims.generateFrameNumbers(`planet6`),
			frameRate: 10,
			repeat: -1
		});
		this.anims.create({
			key: "p7",
			frames: this.anims.generateFrameNumbers(`planet7`),
			frameRate: 10,
			repeat: -1
		});
		this.anims.create({
			key: "p8",
			frames: this.anims.generateFrameNumbers(`planet8`),
			frameRate: 10,
			repeat: -1
		});
		this.anims.create({
			key: "p9",
			frames: this.anims.generateFrameNumbers(`planet9`),
			frameRate: 10,
			repeat: -1
		});
		this.anims.create({
			key: "p10",
			frames: this.anims.generateFrameNumbers(`planet10`),
			frameRate: 10,
			repeat: -1
		});
		this.anims.create({
			key: "p11",
			frames: this.anims.generateFrameNumbers(`planet11`),
			frameRate: 10,
			repeat: -1
		});
		this.anims.create({
			key: "p12",
			frames: this.anims.generateFrameNumbers(`planet12`),
			frameRate: 10,
			repeat: -1
		});
	}
	createLoadingStat() {
		// Adding backgrounds and mountain ranges.
		this.background = this.add.tileSprite(
			0,
			0,
			config.width,
			config.height,
			'background'
		);
		this.background.setScale(2);

		// Adding Loading Text and Progress Percentage Text
		this.welcomeLabel = this.add.bitmapText(
			200,
			150,
			'pixelFont',
			'Loading...',
			60
		);
		this.progressText = this.add.bitmapText(250, 210, 'pixelFont', '0%', 60);

		// Adding Progress Bar and Bar Border Graphics
		this.progress = this.add.graphics({ x: 20, y: config.width / 2 + 5 });
		this.border = this.add.graphics({ x: 20, y: config.width / 2 + 5 });

		// When a file is loaded, Phaser emits a 'progress' event with
		// progress percentage in decimal form as output (such as 0.66)
		// Listen and redraw Bar and Border to reflect progress
		this.load.on(
			'progress',
			(val) => {
				let perc = Math.round(val * 100) + '%';

				this.progressText.setText(perc);

				this.progress.clear();
				this.progress.fillStyle('0xFF0000', 0.75);
				this.progress.fillRect(0, 0, (config.width - 40) * val, 18);
				this.border.clear();
				this.border.lineStyle(2, '0x4D6592', 1);
				this.border.strokeRect(0, 0, (config.width - 40) * val, 18, 2);
			},
			this
		);

		// When all files are loaded, Phaser emits a 'complete' event
		// Listen and start the menu
		this.load.on('complete', () => {
			let stats = {
				"planet_count": 0,
				"planet1":{
				},
				"planet2":{
				},
				"planet3":{
				},
				"planet4":{
				},
				"planet5":{
				}
			}
			this.progressText.setText('Complete');
			this.scene.start('menuGame');
		});
	}

}
