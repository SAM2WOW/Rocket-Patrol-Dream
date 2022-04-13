class Menu extends Phaser.Scene {
    constructor() {
        super("menu");
    }
    preload() {
        this.load.image('bg', 'assets/bg.png');

        // load audio
        this.load.audio('sfx_select', 'assets/select.wav');
        this.load.audio('sfx_explosion', 'assets/explosion.wav');
        this.load.audio('sfx_rocket', 'assets/shoot.wav');
    }
    create() {
        this.bg = this.add.tileSprite(0, 0, 1920, 1080, 'bg').setOrigin(0, 0);

        this.title = this.add.text(320, 200, "SWEET DREAM");

        this.title.setFontFamily('PixelFont');
        this.title.setFontSize(40);
        this.title.setColor('#ffffff');
        this.title.setStroke('#000000', 5);
        this.title.setShadow(2, 2, "#333333", 2, false, true);
        this.title.setOrigin(0.5, 0.5);
        this.title.setDepth(1);

        // add tutorials
        this.add.text(320, 300, "Use ⬅️➡️ to move / [F] to fire", {fontFamily: 'PixelFont'}).setOrigin(0.5, 0.5);
        this.add.text(320, 350, "Press ⬅️ for Novice or ➡️ for Expert", {fontFamily: 'PixelFont'}).setOrigin(0.5, 0.5);
        
        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        //this.scene.start("play");
    }
    update() {
        this.bg.tilePositionY -= 1;

        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            // easy mode
            game.settings = {
                spaceshipSpeed: 6,
                gameTimer: 60000
            }
            this.sound.play('sfx_select');
            this.scene.start("play");
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            // expert mode
            game.settings = {
                spaceshipSpeed: 8,
                gameTimer: 45000
            }
            this.sound.play('sfx_select');
            this.scene.start("play");
        }
    }
}