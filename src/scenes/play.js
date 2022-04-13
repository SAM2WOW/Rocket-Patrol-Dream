class Play extends Phaser.Scene {
    constructor() {
        super("play");
    }

    preload() {
        this.load.image('bg', 'assets/bg.png');
        this.load.image('bg2', 'assets/bg2.png');
        this.load.image('bg3', 'assets/bg3.png');
        this.load.image('bg4', 'assets/stars.png');

        this.load.image('rocket', 'assets/rocket.png');
        this.load.image('ship', 'assets/spaceship.png');
        this.load.image('bullet', 'assets/bullet.png');

        this.load.spritesheet('explosion', 'assets/boom.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    
        this.load.audio('bgm', 'assets/bgm.ogg');
    }

    create() {
        // parallax backgrounds
        this.bg = this.add.tileSprite(0, 0, 1920, 1080, 'bg').setOrigin(0, 0);
        this.bg2 = this.add.tileSprite(0, 0, 1920, 1080, 'bg2').setOrigin(0, 0);
        this.bg2.tilePositionX = 500;

        this.bg3 = this.add.tileSprite(0, 0, 1920, 1080, 'bg3').setOrigin(0, 0);
        this.bg4 = this.add.tileSprite(0, 0, 1920, 1080, 'bg4').setOrigin(0, 0);
        
        // add rocket
        this.rocket = new Rocket(this, game.config.width / 2, game.config.height - borderUISize - borderPadding, 'rocket');
        this.rocket.setOrigin(0.5, 0.5);

        // bullets
        this.bullets = this.physics.add.group();
        this.bullets.runChildUpdate = true;

        // add 3 ship
        this.ship1 = new Spaceship(this, Math.random() * game.config.width, game.config.height / 2 - 300, 'ship', 0, 30);
        this.ship1.setOrigin(0.5, 0.5);
        this.ship2 = new Spaceship(this, Math.random() * game.config.width, game.config.height / 2 - 150, 'ship', 0, 20);
        this.ship2.setOrigin(0.5, 0.5);
        this.ship3 = new Spaceship(this, Math.random() * game.config.width, game.config.height / 2, 'ship', 0, 10);
        this.ship3.setOrigin(0.5, 0.5);
        
        this.ships = this.physics.add.group();
        this.ships.runChildUpdate = true;
        this.ships.add(this.ship1);
        this.ships.add(this.ship2);
        this.ships.add(this.ship3);
        
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

        // GAME OVER flag
        this.gameOver = false;

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, this.stopGame, null, this);

        // play background music
        this.backgroundMusic = this.sound.add('bgm');
        this.backgroundMusic.setLoop(true);
        this.backgroundMusic.play();
    }

    lerp(start, end, amt) {
        return (1-amt)*start+amt*end
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
            this.bg2.tilePositionX -= 0.4 * delta / 16;
            this.bg3.tilePositionX -= 0.8 * delta / 16;
            this.bg4.tilePositionX -= 1.2 * delta / 16;

            this.rocket.update(time, delta);
        }

        // checking everything
        this.physics.add.overlap(this.rocket, this.ships, function(rocket, ship){
            this.shipExplode(ship);
            rocket.reset();
        }, null, this);

    }

    screenShake() {
        this.tweens.add({
            targets: this.bg,
            duration: 200,
            x: { from: 0, to: Math.random() * 5 },
            y: { from: 0, to: Math.random() * 5 },
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: 1
        });
        this.tweens.add({
            targets: this.bg2,
            duration: 150,
            x: { from: 0, to: Math.random() * 6 },
            y: { from: 0, to: Math.random() * 6 },
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: 1
        });
        this.tweens.add({
            targets: this.bg3,
            duration: 100,
            x: { from: 0, to: Math.random() * 7 },
            y: { from: 0, to: Math.random() * 7 },
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: 1
        });
        this.tweens.add({
            targets: this.bg4,
            duration: 80,
            x: { from: 0, to: Math.random() * 8 },
            y: { from: 0, to: Math.random() * -8 },
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: 1
        });
    }

    shipExplode(ship) {
        if (ship.killed == true) {
            return;
        }

        ship.alpha = 0;
        ship.killed = true;

        // increase score
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
        console.log(ship.points);
        console.log(this.p1Score);

        this.sound.play('sfx_explosion');

        this.screenShake();

        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');
        boom.on('animationcomplete', () => {
            ship.reset();
            ship.alpha = 1;
            boom.destroy();
        });
    }

    rocketExplode(bullet) {
        if (!this.gameOver) {
            this.stopGame();
        }
    }

    stopGame() {
        this.gameOver = true;

        this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
        this.guide = this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', scoreConfig);
        this.guide.setOrigin(0.5, 0.5);
        this.guide.setFontSize(20);
        
    }
}