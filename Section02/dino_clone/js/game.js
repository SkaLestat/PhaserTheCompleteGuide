import PlayScene from "./scenes/playScene.js";
import PreloadScene from "./scenes/preloadScene.js";

export const PRELOAD_CONFIG = {
    cactusesCount: 6,
    birdsCount: 1
}

const CONFIG = {
    type: Phaser.AUTO,
    width: 1000,
    height: 340,
    physics: {
        default: 'arcade',
        arcade: {
            // gravity: { y: 200 }
            debug: true
        }
    },
    scene: [
        PreloadScene,
        PlayScene
    ],
    pixelArt: true,
    transparent: true,
    banner: {
        hidePhaser: true
    },
    // fps:{
    //     limit: 30
    // }
};
new Phaser.Game(CONFIG);