class Rocket extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // variables
        this.isFiring = false;
        this.moveSpeed = 8;

        this.sfxRocket = scene.sound.add('sfx_rocket');

        this.abwidth = 54;
        this.abheight = 109;
        this.body.setSize(this.abwidth, this.abheight);
    }

    lerp(start, end, amt) {
        return (1-amt)*start+amt*end
    }

    update(time, delta) {
        // move rocket
        if (!this.isFiring) {
            if (keyLEFT.isDown && this.x >= 0) {
                this.x -= this.moveSpeed * delta / 16;
                this.setRotation(this.lerp(this.rotation, -Math.PI / 3, 0.2));
            }
            else if (keyRIGHT.isDown && this.x <= game.config.width) {
                this.x += this.moveSpeed * delta / 16;
                this.setRotation(this.lerp(this.rotation, Math.PI / 3, 0.2));
            }
            else {
                this.setRotation(this.lerp(this.rotation, 0, 0.2));
            }
        }
        
        // fire rocket
        if (Phaser.Input.Keyboard.JustDown(keyF) && !this.isFiring) {
            this.isFiring = true;
            this.sfxRocket.play();
        }

        // move rocket up when fired
        if (this.isFiring && this.y >= 0 - this.height / 2) {
            this.y -= this.moveSpeed * delta / 16;
            this.setRotation(this.lerp(this.rotation, 0, 0.1));
        }

        // reset rocket
        if (this.y <= 0 - this.height / 2) {
            this.reset();
        }
    }

    reset() {
        this.isFiring = false;
        this.y = game.config.height - borderUISize - borderPadding;
    }
}