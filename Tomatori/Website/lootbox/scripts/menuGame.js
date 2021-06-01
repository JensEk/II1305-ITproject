class menuGame extends Phaser.Scene{
	constructor(){
		super("menuGame");	
	}
	init(choosenplanets){
		this.totalScore = 0;
		this.bag = choosenplanets;
	}
	preload(){
		// We potentially need a way to retrieve 
		// Planet info of a user, which means
		// we need to access database here and there

		// String names for planets
		this.templates = ["planet1","planet2","planet3","planet4","planet5","planet6","planet7","planet8","planet9","planet10","planet11","planet12"];
		this.stats = {
			"planet_count": 5,
			"planets": [{
				"type": 1,
				"food": 100,
				"mineral": 50,
				"energy": 30,
				"score": 0
			},	
			{
				"type": 3,
				"food": 30,
				"mineral": 71,
				"energy": 50, 
				"score": 0
			},		
			{
				"type": 4,
				"food": 0,
				"mineral": 70,
				"energy": 80, 
				"score": 0
			},		
			{
				"type": 7,
				"food": 0,
				"mineral": 90,
				"energy": 0, 
				"score": 0
			},		
			{
				"type": 7,
				"food": 0,
				"mineral": 70,
				"energy": 20,
				"score": 0
			}]	
		}
	}
	create(){
		this.background = this.add.tileSprite(0,0,config.width,config.height,"background").setScale(2);
		this.planets = this.add.group();

		if(this.bag.length >= 1) {
			
		this.planet1 = this.add.sprite(120,75,this.templates[this.bag[0].type]);
		this.planet1.anims.play(`p${this.bag[0].type}`);
		this.planets.add(this.planet1)

		this.arrow = this.add.image(200,75,"arrow").setFlipX(true);
		this.arrowOption = 0;

		this.calcScore();

		this.highScoreLabel = this.add.bitmapText(450,100,'pixelFont','Total Score: ',35);
		this.highScoreScore = this.add.bitmapText(450,140,'pixelFont',`${this.totalScore}`,35);
		this.foodText = this.add.bitmapText(450,210,'pixelFont',`Food: ${this.bag[0].food}`,30);	
		this.mineralText = this.add.bitmapText(450,260,'pixelFont',`Mineral: ${this.bag[0].mineral}`,30);	
		this.energyText = this.add.bitmapText(450,310,'pixelFont',`Energy: ${this.bag[0].energy}`,30);
		this.planetScore = this.add.bitmapText(450,360,'pixelFont',`Score: ${this.bag[0].score}`,30);
		this.scoreGroup = this.add.group([this.highScoreLabel,this.highScoreScore,this.foodText,this.mineralText,this.energyText,this.planetScore]);
		}

		if(this.bag.length >= 2) {
			this.planet2 = this.add.sprite(220,200, this.templates[this.bag[1].type]);
			this.planet2.anims.play(`p${this.bag[1].type}`);
			this.planets.add(this.planet2)
		}
		
		if(this.bag.length >= 3) {
			this.planet3 = this.add.sprite(120,325,this.templates[this.bag[2].type]);
			this.planet3.anims.play(`p${this.bag[2].type}`);
			this.planets.add(this.planet3)
		}
		
		if(this.bag.length >= 4) {
			this.planet4 = this.add.sprite(220,450,this.templates[this.bag[3].type]);
			this.planet4.anims.play(`p${this.bag[3].type}`);
			this.planets.add(this.planet4)
		}
		
		if(this.bag.length >= 5) {
			this.planet5 = this.add.sprite(120,575,this.templates[this.bag[4].type]);
			this.planet5.anims.play(`p${this.bag[4].type}`);
			this.planets.add(this.planet5)
		}
		
		this.btn_down = this.add.image(620,570,'arrowbtn_up').setScale(2);
		this.btn_down.setInteractive()
				.on("pointerdown", () => {
					this.arrowOption = 
						(this.arrowOption - 1 < 0) ? 
						this.arrowOption = 4 :
						this.arrowOption = (this.arrowOption-1) % 5;
					//console.log(this.arrowOption);
					//console.log(this.arrowOption);
					this.updateArrow(this.arrowOption);
					this.updateStats(this.arrowOption);
				});
		this.btn_down = this.add.image(620,610,'arrowbtn_down').setScale(2);
		this.btn_down.setInteractive()
				.on("pointerdown", () => {
					this.arrowOption = (this.arrowOption+1)%5;
					this.updateArrow(this.arrowOption);
					this.updateStats(this.arrowOption);
				});
		this.btn_loot = this.add.image(550,500,'open_lootbox')
				.setScale(4);
		this.btn_loot.setInteractive()
				.on("pointerdown",() => {
					
					if(this.bag.length > 0)
						this.planets.destroy();

					this.scene.start("lootGame", this.bag);
				});
		this.btn_build = this.add.image(550,590,'build')
				.setScale(4);
		this.visibleBuild = false;
		this.btn_build.setInteractive()
				.on("pointerdown",() => {
					this.displayBuildMenu();
				});

		this.calcScore();

		//this.foodBuild = this.add.image(450,450,'food').setScale(0.5);
		
		this.music = this.sound.add('menuTheme');
		this.music.setVolume(0.01);
		this.music.play({loop: true});

	}

	

	update(){
		this.background.tilePositionX += 0.1;	
	}
	updateArrow(opt){
		switch(opt){
			case 0:
				this.arrow.setPosition(200,75).setFlipX(true);
				break;
			case 1:
				this.arrow.setPosition(140,200).setFlipX(false);
				break;
			case 2:
				this.arrow.setPosition(200,325).setFlipX(true);
				break;
			case 3:
				this.arrow.setPosition(140,450).setFlipX(false);
				break;
			case 4:
				this.arrow.setPosition(200,575).setFlipX(true);
				break;
		}
	}
	updateStats(opt){
		this.foodText.setText(`Food: ${this.bag[opt].food}`);
		this.mineralText.setText(`Mineral: ${this.bag[opt].mineral}`);
		this.energyText.setText(`Energy: ${this.bag[opt].energy}`);
		this.planetScore.setText(`Score: ${this.bag[opt].score}`,30);
	}
	calcScore(){
		this.totalScore = 0;
		var i;
		for(i = 0; i < this.bag.length; i++){
			this.totalScore += this.bag[i].score;
		}
	}
	displayBuildMenu(){
		this.visibleBuild = !this.visibleBuild;
		this.scoreGroup.setVisible(this.visibleBuild);
	}

}

