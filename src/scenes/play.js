class Play extends Phaser.Scene {
    constructor() {
        super("play");
    }

    preload() {
        this.load.image('bg', 'assets/bg.png');
        this.load.image('rocket', 'assets/rocket.png');
        this.load.image('ship', 'assets/spaceship.png');

        this.load.spritesheet('explosion', './assets/boom.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }

    create() {
        this.bg = this.add.tileSprite(0, 0, 640, 480, 'bg').setOrigin(0, 0);

        // code adapted from http://ex-artist.com/CMPM120/Tutorials/Phaser%203%20Rocket%20Patrol%20Tutorial.html
        // green UI background
        this.add.rectangle(borderUISize, borderUISize + borderPadding, game.config.width - borderUISize * 2, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0).setDepth(20);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0).setDepth(20);
        this.add.rectangle(0, 120, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0).setDepth(20);
        this.add.rectangle(game.config.width - borderUISize, 120, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0).setDepth(20);
        
        // add rocket
        this.rocket = new Rocket(this, game.config.width / 2, game.config.height - borderUISize - borderPadding, 'rocket');
        this.rocket.setOrigin(0.5, 0);

        // add 3 ship
        this.ship1 = new Spaceship(this, Math.random() * game.config.width, game.config.height / 2, 'ship', 0, 30);
        this.ship1.setOrigin(0, 0);
        this.ship2 = new Spaceship(this, Math.random() * game.config.width, game.config.height / 2 + 32, 'ship', 0, 20);
        this.ship2.setOrigin(0, 0);
        this.ship3 = new Spaceship(this, Math.random() * game.config.width, game.config.height / 2 + 32 * 2, 'ship', 0, 10);
        this.ship3.setOrigin(0, 0);
        
        // explosion animation
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        
        // initialize score
        this.p1Score = 0;

        // display score
        let scoreConfig = {
            fontFamily: 'PixelFont',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(game.config.width - borderUISize - borderPadding * 2 - 100, borderUISize + borderPadding * 2, this.p1Score, scoreConfig);

        // display fire sign
        let fireConfig = {
            fontFamily: 'PixelFont',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.fireSign = this.add.text(game.config.width / 2 - 50, borderUISize + borderPadding * 2, 'FIRE', fireConfig);
        this.fireSign.setAlpha(0);

        // GAME OVER flag
        this.gameOver = false;

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.guide = this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', scoreConfig);
            this.guide.setOrigin(0.5, 0.5);
            this.guide.setFontSize(20);
            this.gameOver = true;
        }, null, this);

    }

    update(time, delta) {
        // check key input for restart
        if (Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }

        // keep for going back to menu
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menu");
        }

        // update everything
        if (!this.gameOver) {
            this.bg.tilePositionX -= 2 * delta / 16;

            this.rocket.update(time, delta);
            this.ship1.update(time, delta);
            this.ship2.update(time, delta);
            this.ship3.update(time, delta);
        }

        // checking everything
        if (this.checCollision(this.rocket, this.ship1)) {
            this.shipExplode(this.ship1);
            this.rocket.reset();
        }
        if (this.checCollision(this.rocket, this.ship2)) {
            this.shipExplode(this.ship2);
            this.rocket.reset();
        }
        if (this.checCollision(this.rocket, this.ship3)) {
            this.shipExplode(this.ship3);
            this.rocket.reset();
        }

        // update fire sign
        this.fireSign.setAlpha(this.rocket.isFiring ? 1 : 0);
    }

    checCollision(rocket, ship) {
        if (rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y) {
            // collision detected!
            console.log("collision detected!");
            return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) {
        ship.alpha = 0;

        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');
        boom.on('animationcomplete', () => {
            ship.reset();
            ship.alpha = 1;
            boom.destroy();
        });

        // increase score
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
        console.log(ship.points);
        console.log(this.p1Score);

        this.sound.play('sfx_explosion');
    }
}