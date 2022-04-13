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

        this.reset();
    }

    update(time, delta) {
        // move spaceship left
        this.x -= this.moveSpeed * this.random_speed_multiplier * delta / 16;

        // wrap around
        if(this.x <= 0 - this.width / 2) {
            this.reset();
        }

        // random chance to fire
        if(!this.killed && Math.random() > 0.99) {
            this.fire();
        }
    }

    reset() {
        this.x = game.config.width + this.width / 2;
        
        this.random_speed_multiplier = Math.random() * (1.5 - 0.5) + 0.5;
        
        this.killed = false;
    }

    fire() {
        // add bullets
        var bullet = new Bullet(this.scene, this.x, this.y, 'bullet');
        this.scene.bullets.add(bullet);
    }
}