import { PRELOAD_CONFIG } from "../game.js";

class PreloadScene extends Phaser.Scene {
    constructor(){
        super("PreloadScene");
    }

    preload(){
        this.load.image("ground", "./assets/ground.png");
        this.load.image("dino-idle", "./assets/dino-idle-2.png");
        this.load.image("dino-hurt", "./assets/dino-hurt.png");
        this.load.image("restart", "./assets/restart.png");
        this.load.image("game-over", "./assets/game-over.png");
        this.load.image("cloud", "./assets/cloud.png");
        for(let i = 1; i <= PRELOAD_CONFIG.cactusesCount; i++){
            this.load.image(`obstacle_${i}`, `./assets/cactuses_${i}.png`);
        }
        /* this.load.image("obstacle_1", "./assets/cactuses_1.png");
        this.load.image("obstacle_2", "./assets/cactuses_2.png");
        this.load.image("obstacle_3", "./assets/cactuses_3.png");
        this.load.image("obstacle_4", "./assets/cactuses_4.png");
        this.load.image("obstacle_5", "./assets/cactuses_5.png");
        this.load.image("obstacle_6", "./assets/cactuses_6.png"); */
        this.load.spritesheet("dino-run", "./assets/dino-run.png", {
            frameWidth: 88,
            frameHeight: 94
        });
        this.load.spritesheet("dino-down", "./assets/dino-down-2.png", {
            frameWidth: 118,
            frameHeight: 94
        });
        this.load.spritesheet("enemy-bird", "./assets/enemy-bird.png", {
            frameWidth: 92,
            frameHeight: 77
        });
        this.load.audio("jump", "./assets/jump.m4a");
        this.load.audio("hit", "./assets/hit.m4a");
        this.load.audio("progress", "./assets/reach.m4a");
    }
    create(){
        this.scene.start("PlayScene");
    }

}

export default PreloadScene;