// Name: Sam Feng
// Project Title: Sweet Dream
// Date: 4/14/2022
// Time Spent: 10 hours

// Assets are created by myself or edited from CC0 web assets
 
// #FACADE Tier (confimed with professor Adam)
// new object: Bullets (40)
// new art for objects (20)
// new randomize sound effects (10)
// new music (5)
// Display the time remaining (in seconds) on the screen (10)
// new title screen design (10)
// screen shake (5)

// ADDITIONAL WORKS
// Implement parallax scrolling (10)
// Allow the player to control the Rocket after it's fired (5)
// Use Phaser's particle emitter (20)
// Redesign the game's artwork, UI, and sound to change its theme/aesthetic (to something other than sci-fi) (60)

var config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'phaser-example',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1920,
        height: 1080
    },
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    },
    scene: [Menu, Play],
    callbacks: {
        postBoot: function (game) {
          // In v3.15, you have to override Phaser's default styles
          game.canvas.style.width = '100%';
          game.canvas.style.height = '100%';
        }
    }
};

let game = new Phaser.Game(config);

// code adapted from http://ex-artist.com/CMPM120/Tutorials/Phaser%203%20Rocket%20Patrol%20Tutorial.html
// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// reserve keyboard vars
let keyF, keyR, keyM, keyLEFT, keyRIGHT, keyUP;