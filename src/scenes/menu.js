class Menu extends Phaser.Scene {
    constructor() {
        super("menu");
    }
    preload() {
        this.load.image('bg', 'assets/bg.jpg');
        this.load.image('rocket', 'assets/rocket.png');

        // load audio
        this.load.audio('sfx_select', 'assets/select.mp3');
        this.load.audio('sfx_explosion', 'assets/explosion.mp3');
        this.load.audio('sfx_rocket', 'assets/shoot.mp3');
        this.load.audio('bullet1', 'assets/bullet1.mp3');
        this.load.audio('bullet2', 'assets/bullet2.mp3');
        this.load.audio('bullet3', 'assets/bullet3.mp3');
    }
    create() {
        this.bg = this.add.tileSprite(0, 0, 1920, 1080, 'bg').setOrigin(0, 0);
        
        this.title = this.add.text(game.config.width / 2, game.config.height / 2, "Sweet Dream");

        this.title.setFontFamily('PixelFont');
        this.title.setFontSize(150);
        this.title.setColor('#ffffff');
        this.title.setStroke('#000000', 10);
        this.title.setShadow(2, 2, "#333333", 2, false, true);
        this.title.setOrigin(0.5, 0.5);
        this.title.setDepth(1);

        // add tutorials
        this.add.text(game.config.width / 2, game.config.height / 2 - 150, "hope you have a ...", {fontFamily: 'PixelFont', fontSize: 75}).setOrigin(0.5, 0.5).setStroke('#000000', 7).setShadow(2, 2, "#333333", 2, false, true);;
        this.add.text(game.config.width / 2, game.config.height / 2 + 300, "[←] [→] Move | [F] Fire | [F11] Toggle Fullscreen", {fontFamily: 'PixelFont', fontSize: 40}).setOrigin(0.5, 0.5).setStroke('#000000', 5).setShadow(2, 2, "#333333", 2, false, true);;
        this.add.text(game.config.width / 2, game.config.height / 2 + 350, "[←] for Novice | [→] for Expert", {fontFamily: 'PixelFont', fontSize: 50}).setOrigin(0.5, 0.5).setStroke('#000000', 5).setShadow(2, 2, "#333333", 2, false, true);;
        
        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // particles
        var particles = this.add.particles('rocket');
        this.emitter = particles.createEmitter({
            x: game.config.width / 2,
            y: game.config.height / 2,
            angle: { min: 0, max: 360 },
            scale: { min: 0.2, max: 2, from: 0.2, ease: 'Cubic.InOut' },
            frequency: 100,
            speed: { min: 100, max: 200 },
            rotate: { min: 0, max: 360 },
            gravityY: 0,
            lifespan: { min: 500, max: 5000 },
            alpha: { start: 1, end: 0 },
            blendMode: 'ADD'
        });
    }
    update(time, delta) {
        this.bg.tilePositionX += 0.2 * delta / 16;

        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            // easy mode
            game.settings = {
                spaceshipSpeed: 6,
                bulletTime: 2000,
                gameTimer: 60000
            }
            this.sound.play('sfx_select');
            this.scene.start("play");
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            // expert mode
            game.settings = {
                spaceshipSpeed: 8,
                bulletTime: 1000,
                gameTimer: 45000
            }
            this.sound.play('sfx_select');
            this.scene.start("play");
        }
    }
}