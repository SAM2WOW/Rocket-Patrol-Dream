class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.moveSpeed = 8;

        this.sfxRocket = scene.sound.add('sfx_rocket');

        this.abwidth = 54;
        this.abheight = 109;
        this.body.setSize(this.abwidth, this.abheight);

        bullets.add(this);
    }

    update(time, delta) {
        // move bullet
        this.y += this.moveSpeed * delta / 16;

        if (this.y >= game.config.height + this.height / 2) {
            this.destroy();
        }
    }
}