class Spaceship extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.points = pointValue;
        this.moveSpeed = game.settings.spaceshipSpeed;

        this.random_speed_multiplier = Math.random() * (1.5 - 0.5) + 0.5;

        this.abwidth = 309;
        this.abheight = 211;
        this.body.setSize(this.abwidth, this.abheight);

        this.killed = false;

        this.firetimer = 0.0;

        this.reset();
        
        var particles = this.scene.add.particles('smoke');
        this.emitter = particles.createEmitter({
            x: this.x + 349 - this.width / 2,
            y: this.y + 131 - this.height / 2,
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

    update(time, delta) {
        // move spaceship left
        this.x -= this.moveSpeed * this.random_speed_multiplier * delta / 16;

        // move particles
        this.emitter.setPosition(this.x + 349 - this.width / 2, this.y + 131 - this.height / 2);

        // wrap around
        if(this.x <= 0 - this.width / 2) {
            this.reset();
        }

        // random chance to fire
        this.firetimer += delta;
        if(!this.killed && this.firetimer >= game.settings.bulletTime) {
            this.fire();
            this.firetimer = 0.0;
        }
    }

    reset() {
        this.x = game.config.width + this.width / 2;
        
        this.random_speed_multiplier = Math.random() * (1.5 - 0.5) + 0.5;
        
        this.killed = false;

        this.firetimer = 0.0;

        this.scene.tweens.add({
            targets: this,
            duration: 4000,
            rotation: { from: this.rotation + 0.01, to: this.rotation - 0.01},
            ease: 'Cubic.InOut',
            yoyo: true,
        });
    }

    fire() {
        // add bullets
        var bullet = new Bullet(this.scene, this.x, this.y, 'bullet');
        this.scene.bullets.add(bullet);

        // animation
        this.scene.tweens.add({
            targets: this,
            duration: 500,
            scaleX: { from: 1.1, to: 1 },
            scaleY: { from: 1.1, to: 1 },
            yoyo: false,
            ease: 'Cubic.InOut',
        });
    }
}