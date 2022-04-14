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

        this.reset();

        this.setDepth(5);

        var particles = this.scene.add.particles('rocket');
        this.emitter = particles.createEmitter({
            x: this.x,
            y: this.y,
            angle: { min: 80, max: 100 },
            scale: { min: 0.2, max: 0.4, from: 0.2, ease: 'Cubic.InOut' },
            frequency: 100,
            speed: 100,
            rotate: { min: 0, max: 360 },
            gravityY: 0,
            lifespan: { min: 500, max: 1000 },
            alpha: { start: 1, end: 0 },
            blendMode: 'ADD'
        });
    }

    lerp(start, end, amt) {
        return (1-amt)*start+amt*end
    }

    update(time, delta) {
        // move particles
        this.emitter.setPosition(this.x, this.y);

        // move rocket
        if (true) {
            if (keyLEFT.isDown && this.x >= 0) {
                this.x -= this.moveSpeed * delta / 16;
                this.setRotation(this.lerp(this.rotation, -Math.PI / 5, 0.2));
            }
            else if (keyRIGHT.isDown && this.x <= game.config.width) {
                this.x += this.moveSpeed * delta / 16;
                this.setRotation(this.lerp(this.rotation, Math.PI / 5, 0.2));
            }
            else {
                this.setRotation(this.lerp(this.rotation, 0, 0.2));
            }
        }
        
        // fire rocket
        if (Phaser.Input.Keyboard.JustDown(keyF) && !this.isFiring) {
            this.isFiring = true;

            this.sfxRocket.detune = this.lerp(0, 500, Math.random());
            this.sfxRocket.volume = this.lerp(0.5, 1, Math.random());
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

        // spawn animation
        this.setScale(0);
        this.setAlpha(0.7);
        this.body.enable = false;
        this.scene.tweens.add({
            targets: this,
            duration: 500,
            scaleX: { from: 0, to: 1 },
            scaleY: { from: 0, to: 1 },
            ease: 'Bounce.Out',
            onComplete: () => {
                this.body.enable = true;
                this.setAlpha(1);
            }
        });
    }
}