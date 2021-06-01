/*
 *	Main Menu Scene
 *	
 *	All rendering related to main menu goes here
 *	All preloading goes to loadGame.js
 *	Game Over Scene redirect should be here.
 */

class menuGame extends Phaser.Scene {

  constructor() {
    super("menuGame");
  }


  create() {


    // Loading the background sprites, Setting their Pivot to 0,0
    // Then lock to make sure the camera won't follow 
    this.background = this.add.tileSprite(0, 0, game.config.width, game.config.height, "bg-1");
    this.background.setOrigin(0, 0);

    this.backMountain = this.add.tileSprite(0, 0, game.config.width, game.config.height, "bg-2");
    this.backMountain.setOrigin(0, 0);

    this.frontMountain = this.add.tileSprite(0, 0, game.config.width, game.config.height, "bg-3");
    this.frontMountain.setOrigin(0, 0);
    this.frontMountain.y = 60;


    // Variable for SPACE-BAR event 
    this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Group for startMenu and Options Menu
    // and Initialize the Options Menu
    this.startMenuGroup = this.add.group();
    this.optionsMenuGroup = this.add.group();
    this.createOptionMenu();

    // Static Bird showing on screen, disabled gravity so it won't fall
    // Make it invisible until we hover over Play button 

    this.player = this.physics.add.sprite(320, 300, "tomatori");
    this.player.body.setAllowGravity(false);
    this.player.setVisible(false);

    // Play Button, Click will start the game
    this.playButton = this.add.image(config.width / 2, config.height / 2 + 50, "play");
    this.playButton.setScale(2);
    this.playButton
      .setInteractive()
      .on("pointerdown", () => {

        if (userData.lifeTracker > 0) {
          this.music.stop();
          this.scene.start("gamePlay", "0");
        }
      });
    this.playButton
      .on("pointerover", () => {
        this.player.setVisible(true);
      });
    this.playButton
      .on("pointerout", () => {
        this.player.setVisible(false);
      });
    this.startMenuGroup.add(this.playButton);

    // Option Menu placeholder
    this.optionButton = this.add.image(config.width / 2, config.height / 2 + 100, "options");
    this.optionButton.setScale(2);
    this.optionButton
      .setInteractive()
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
        this.showOptionMenu();
      });
    this.startMenuGroup.add(this.optionButton);

    // Animation for On-Death Explosion
    this.anims.create({
      key: "explode",
      frames: this.anims.generateFrameNumbers("explosion"),
      frameRate: 15,
      repeat: 0,
      hideOnComplete: true // disappear when triggered
    });

    // Animation for Bird Wings
    this.anims.create({
      key: "fly",
      frames: this.anims.generateFrameNumbers("tomatori"),
      frameRate: 10,
      repeat: -1
    });

    // Key for Initializing Fullscreen
    this.fullScreenKey = this.input.keyboard.addKey('F');
    this.fullScreenKey.on('down', function() {
      if (this.scale.isFullscreen) {
        this.scale.stopFullscreen();
      } else {
        this.scale.startFullscreen();
      }
    }, this);

    // Load and start the music, make sure it loops
    this.music = this.sound.add('menu');
    this.music.play();
    this.music.setVolume(0.3);

    // Start Bird Wing animation	
    this.player.anims.play("fly");

    this.text = this.add.bitmapText(155, 200, "pixelFont", "T O M A T O R I", 48);
    this.text.setDepth(1000);
    this.startMenuGroup.add(this.text);

    // Adding an arrow to move with cursors
    this.arrow = this.physics.add.sprite(config.width / 2 - 85, config.height / 2 + 100, 'arrow');
    this.arrow.body.setAllowGravity(false);
    this.arrowCursor = this.input.keyboard.createCursorKeys();

    // Handlers for the red arrow
    this.optionsarrow = true;
    this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.option = 1;


  }

  // Rendering bg_3 moving mountains 
  update() {
    this.backMountain.tilePositionX += 0.1;
    this.frontMountain.tilePositionX += 0.5;

    this.moveArrow();

  }

  // Function to move red arrow arround options
  moveArrow() {

    if (this.optionsarrow) {
      if (this.arrowCursor.down.isDown) {
        this.arrow.y = config.height / 2 + 100
        this.player.setVisible(false);
      }
      else if (this.arrowCursor.up.isDown) {
        this.arrow.y = config.height / 2 + 50
        this.player.setVisible(true);
      }
    }
    else if (!this.optionsarrow) {
      if (Phaser.Input.Keyboard.JustDown(this.arrowCursor.down)) {

        switch (this.option) {

          case 1:
            this.arrow.y = config.height / 2 + 60;
            this.option = 2;
            break;

          case 2:
            this.arrow.y = config.height / 2 + 120;
            this.option = 3;
            break;

          case 3:
            this.arrow.y = config.height / 2 + 175;
            this.arrow.x = config.width / 2 - 85
            this.option = 4;
            break;

          case 4:
            this.arrow.y = config.height / 2 + 220;
            this.arrow.x = config.width / 2 - 85;
            this.option = 5;
            break;

          case 5:
            this.arrow.y = config.height / 2;
            this.arrow.x = 90;
            this.option = 1;
            break;
        }
      }
      else if (Phaser.Input.Keyboard.JustDown(this.arrowCursor.up)) {

        switch (this.option) {

          case 1:
            this.arrow.y = config.height / 2 + 220;
            this.arrow.x = config.width / 2 - 85
            this.option = 5;
            break;

          case 2:
            this.arrow.y = config.height / 2;
            this.option = 1;
            break;

          case 3:
            this.arrow.y = config.height / 2 + 60;
            this.option = 2;
            break;

          case 4:
            this.arrow.y = config.height / 2 + 120;
            this.arrow.x = 90;
            this.option = 3;
            break;

          case 5:
            this.arrow.y = config.height / 2 + 175;
            this.arrow.x = config.width / 2 - 85;
            this.option = 4;
            break;
        }
      }
    }
    if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {

      if (this.optionsarrow) {

        switch (this.arrow.y) {

          case (config.height / 2 + 100):
            this.showOptionMenu();
            break;

          case (config.height / 2 + 50):
            if (userData.lifeTracker > 0) {
              this.music.stop();
              this.scene.start("gamePlay", "0");
            }
            break;
        }
      }
      else if (!this.optionsarrow) {

        async function getTomato(value, currentTomato, currentLife) {
          const points = await userData.getPom();
          if (points >= value) {
            userData.decrementPom(value);
            userData.lifeTracker += value;
            currentLife.setText(`Your Life Counter: ${userData.lifeTracker}`);
            currentTomato.setText("Your Tomato Counter:" + (points - value));
          }
        }

        async function resetTomato(value, currentTomato, currentLife) {
          const points = await userData.incrementPom(value);
          userData.lifeTracker -= value;
          currentLife.setText(`Your Life Counter: ${userData.lifeTracker}`);
          currentTomato.setText("Your Tomato Counter:" + (points));
        }


        switch (this.arrow.y) {

          case (config.height / 2):
            getTomato(1, this.currentTomato, this.currentLife);
            break;

          case (config.height / 2 + 60):
            getTomato(5, this.currentTomato, this.currentLife);
            break;

          case (config.height / 2 + 120):
            getTomato(10, this.currentTomato, this.currentLife);
            break;

          case (config.height / 2 + 175):
            resetTomato(userData.lifeTracker, this.currentTomato, this.currentLife);
            break;

          case (config.height / 2 + 220):
            this.hideOptionMenu();
            break;

        }
      }
    }
  }




  createOptionMenu() {
    // All components added here are and should be placed in
    // optionsMenuGroup, to easily control visibility


    async function printTomato(currentTomato, currentLife) {
      const points = await userData.getPom();

      currentTomato.setText("Your Tomato Counter:" + points);
      console.log(points);
      currentLife.setText(`Your Life Counter: ${userData.lifeTracker}`);
      console.log(userData.lifeTracker);
    }


    this.currentLife = this.add.bitmapText(config.width / 4 + 35, config.height / 4, "pixelFont", "Your Life Counter: " + userData.lifeTracker, 24);
    this.currentTomato = this.add.bitmapText(config.width / 4 + 35, config.height / 3, "pixelFont", "Your Tomato Counter: ", 24);
    this.optionsMenuGroup.add(this.currentLife);
    this.optionsMenuGroup.add(this.currentTomato);
    printTomato(this.currentTomato, this.currentLife);


    // Using Tomato Clouds textures to make easy
    // 1 life, 5 life and 10 life buttons
    this.oneLifeBtn = this.add.image(config.width / 4, config.height / 2, "cloud3")
      .setScale(0.25)
      .setInteractive()
      .on("pointerdown", () => {

        async function getTomato(value, currentTomato, currentLife) {
          const points = await userData.getPom();
          if (points >= value) {
            userData.decrementPom(value);
            userData.lifeTracker += value;
            currentLife.setText(`Your Life Counter: ${userData.lifeTracker}`);
            currentTomato.setText("Your Tomato Counter:" + (points - value));
          }
        }
        getTomato(1, this.currentTomato, this.currentLife);
      });
    this.optionsMenuGroup.add(this.oneLifeBtn);
    this.oneLifeTxt = this.add.bitmapText(config.width / 4 + 50, config.height / 2 - 10, "pixelFont", "Press to Top Up 1 Life", 30);
    this.optionsMenuGroup.add(this.oneLifeTxt);

    this.fiveLifeBtn = this.add.image(config.width / 4, config.height / 2 + 60, "cloud2")
      .setScale(0.25)
      .setInteractive()
      .on("pointerdown", () => {

        async function getTomato(value, currentTomato, currentLife) {
          const points = await userData.getPom();
          if (points >= value) {
            userData.decrementPom(value);
            userData.lifeTracker += value;
            currentLife.setText(`Your Life Counter: ${userData.lifeTracker}`);
            currentTomato.setText("Your Tomato Counter:" + (points - value));
          }
        }
        getTomato(5, this.currentTomato, this.currentLife);

      })
    this.optionsMenuGroup.add(this.fiveLifeBtn);
    this.fiveLifeTxt = this.add.bitmapText(config.width / 4 + 50, config.height / 2 + 60 - 10, "pixelFont", "Press to Top Up 5 Life", 30);
    this.optionsMenuGroup.add(this.fiveLifeTxt);


    this.tenLifeBtn = this.add.image(config.width / 4, config.height / 2 + 120, "cloud1")
      .setScale(0.25)
      .setInteractive()
      .on("pointerdown", () => {

        async function getTomato(value, currentTomato, currentLife) {
          const points = await userData.getPom();
          if (points >= value) {
            userData.decrementPom(value);
            userData.lifeTracker += value;
            currentLife.setText(`Your Life Counter: ${userData.lifeTracker}`);
            currentTomato.setText("Your Tomato Counter:" + (points - value));
          }
        }
        getTomato(10, this.currentTomato, this.currentLife);

      })
    this.optionsMenuGroup.add(this.tenLifeBtn);
    this.tenLifeTxt = this.add.bitmapText(config.width / 4 + 50, config.height / 2 + 120 - 10, "pixelFont", "Press to Top Up 10 Life", 30);
    this.optionsMenuGroup.add(this.tenLifeTxt);

    // Exit button reused to let player return to main menu
    this.exitOptionBtn = this.add.image(config.width / 2, config.height * 4 / 5 + 30, "exit")
      .setScale(2)
      .setInteractive()
      .on("pointerdown", () => {
        this.hideOptionMenu();
      });
    this.optionsMenuGroup.add(this.exitOptionBtn);

    // resetbutton for choice of life
    this.resetBtn = this.add.image(config.width / 2, config.height * 4 / 5 - 20, "reset")
      .setScale(0.25)
      .setInteractive()
      .on("pointerdown", () => {

        async function resetTomato(value, currentTomato, currentLife) {
          const points = await userData.incrementPom(value);
          userData.lifeTracker -= value;
          currentLife.setText(`Your Life Counter: ${userData.lifeTracker}`);
          currentTomato.setText("Your Tomato Counter:" + (points));

        }
        resetTomato(userData.lifeTracker, this.currentTomato, this.currentLife);

      })
    this.optionsMenuGroup.add(this.resetBtn);


    // Since this is the initialization and game start
    // at main Menu, hide all Option menu components
    this.optionsMenuGroup.setVisible(false);
  }

  // Two self explanatory helper functions
  showOptionMenu() {
    this.startMenuGroup.setVisible(false);
    this.optionsMenuGroup.setVisible(true);
    this.optionsarrow = false;
    this.arrow.y = config.height / 2;
    this.arrow.x = 90;
  }
  hideOptionMenu() {
    this.optionsMenuGroup.setVisible(false);
    this.startMenuGroup.setVisible(true);
    this.optionsarrow = true;
    this.arrow.y = config.height / 2 + 100
    this.arrow.x = config.width / 2 - 85

  }
  async printTomato(currentTomato, currentLife) {
    const points = await userData.getPom();

    currentTomato.setText("Your Tomato Counter:" + points);
    console.log(points);
    currentLife.setText(`Your Life Counter: ${userData.lifeTracker}`);
    console.log(userData.lifeTracker);
  }


}
