/*
 *
 * 	Loading Scene
 *	Responsible for bare bone loading screen render and all assets preloading
 *	If more assets needs to be added, put it here instead of their specific
 *	scene, unless absolutely needed to.
 */

class loadGame extends Phaser.Scene {
	constructor() {
		super('loadGame');
	}
	// Preload all assets used for the game, begin with
	// progress bar graphics first
	preload() {
		
		// Loading Progress Graphics
		this.createLoadingStat();

		// Loading Player Image and Font
		this.load.image('player', 'assets/tomato_pef32.png');

		// Loading Pipes (Green and Red)
		this.load.image('pipeUP', 'assets/pipe_up.png');
		this.load.image('pipeDOWN', 'assets/pipe_down.png');
		this.load.image('pipeUPr', 'assets/pipe_upRed.png');
		this.load.image('pipeDOWNr', 'assets/pipe_downRed.png');

		// Loading Tomato Clouds
		this.load.image('cloud1', 'assets/tomatcloud1.png');
		this.load.image('cloud2', 'assets/tomatcloud2.png');
		this.load.image('cloud3', 'assets/tomatcloud3.png');

		// Loading Buttons
		this.load.image('play', 'assets/play.png');
		this.load.image('options', 'assets/options.png');
		this.load.image('exit', 'assets/exit.png');
		this.load.image('pause', 'assets/pause.png');

		// Loading Gameover Sprite
		this.load.image('game_over', 'assets/gameover.png');

		// Loading arrow 
		this.load.image('arrow', 'assets/arrow.png');

    this.load.image('reset', 'assets/reset.png');
		

		// Loading Animation Spritesheets
		this.load.spritesheet('explosion', 'assets/explosion.png', {
			frameWidth: 16,
			frameHeight: 16,
		});
		this.load.spritesheet('tomatori', 'assets/tomato_sprite.png', {
			frameWidth: 32,
			frameHeight: 32,
		});

		// Loading Audio Files for Menu and Game
		this.load.audio('hype', ['assets/dominahype.mp3']);
		this.load.audio('menu', ['assets/mainmenu.mp3']);
		this.load.audio('gameover', ['assets/gameover.mp3']);
	}
	createLoadingStat() {
		// Adding backgrounds and mountain ranges.
		this.background = this.add.tileSprite(
			0,
			0,
			game.config.width,
			game.config.height,
			'bg-1'
		);
		this.background.setOrigin(0, 0);

		this.backMountain = this.add.tileSprite(
			0,
			0,
			game.config.width,
			game.config.height,
			'bg-2'
		);
		this.backMountain.setOrigin(0, 0);

		this.frontMountain = this.add.tileSprite(
			0,
			0,
			game.config.width,
			game.config.height,
			'bg-3'
		);
		this.frontMountain.setOrigin(0, 0);
		this.frontMountain.y = 60;

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
			this.progressText.setText('Complete');
			this.scene.start('menuGame');
		});
	}
}
