class pipeObject extends Phaser.GameObjects.Sprite {
	// Takes arguments for up/down pipe and the size of it to adjust where to render it on the screen
	// side and color decides which kind of pipe to be spawned
	constructor(scene, side, size, color) {
		switch (side) {
			case 'up':
				var x = 700;
				var y = config.height - size / 2 + 40;

				switch (color) {
					case 0:
						super(scene, x, y, 'pipeUP');
						break;

					case 1:
						super(scene, x, y, 'pipeUPr');
						break;
				}
				scene.add.existing(this);
				scene.pipeGroup.add(this);
				break;

			case 'down':
				var x = 700;
				var y = 0 + size / 2 - 40;

				switch (color) {
					case 0:
						super(scene, x, y, 'pipeDOWN');
						break;

					case 1:
						super(scene, x, y, 'pipeDOWNr');
						break;
				}
				scene.add.existing(this);
				scene.pipeGroup.add(this);
				break;
		}
	}

	// checks if pipe is out of screen and destroys it
	update() {
		if (this.x < -50) {
			this.destroy();
		}
	}
}
