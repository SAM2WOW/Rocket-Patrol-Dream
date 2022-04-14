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
        this.body.enable = false;
        this.scene.tweens.add({
            targets: this,
            duration: 500,
            scaleX: { from: 0, to: 1 },
            scaleY: { from: 0, to: 1 },
            y: { from: this.y - 200, to: this.y },
            rotation: { from: this.rotation + Math.PI / 2, to: this.rotation},
            ease: 'Bounce.Out',
            onComplete: () => {
                if (this) {
                    this.body.enable = true;
                }
            }
        });

        // sounds
        this.sfxspawn = ['bullet1', 'bullet2', 'bullet3'];
        var index = Math.round(Math.random() * 2); 
        this.sfx = this.scene.sound.add(this.sfxspawn[index]);
        this.sfx.detune = this.scene.lerp(0, 500, Math.random());
        this.sfx.volume = this.scene.lerp(0.5, 1, Math.random());
        this.sfx.play();
    }

    update(time, delta) {
        // move bullet
        this.y += this.moveSpeed * delta / 16;

        if (this.y >= game.config.height + this.height / 2) {
            this.destroy();
        }
    }
}