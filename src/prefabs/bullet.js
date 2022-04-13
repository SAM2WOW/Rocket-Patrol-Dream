class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.moveSpeed = 5;

        this.sfxRocket = scene.sound.add('sfx_rocket');

        this.abwidth = 54;
        this.abheight = 109;
        this.body.setSize(this.abwidth, this.abheight);

        // spawn animation
        this.setScale(0);
        this.scene.tweens.add({
            targets: this,
            duration: 500,
            scaleX: { from: 0, to: 1 },
            scaleY: { from: 0, to: 1 },
            ease: 'Bounce.Out',
        });
    }

    

    update(time, delta) {
        // move bullet
        this.y += this.moveSpeed * delta / 16;

        if (this.y >= game.config.height + this.height / 2) {
            this.destroy();
        }
    }
}