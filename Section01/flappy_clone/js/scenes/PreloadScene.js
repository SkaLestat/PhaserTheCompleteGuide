class PreloadScene extends Phaser.Scene {
    constructor(){
        super("PreloadScene");
    }

    preload(){
        this.load.image("gameBg", "./assets/background.png");
        // this.load.image("plane", "./assets/planeRed1.png");
        this.load.spritesheet("plane", "./assets/planes.png", {
            frameWidth: 88,
            frameHeight: 73
        });
        this.load.image("lowerPipe", "./assets/rockGrassDown.png");
        this.load.image("upperPipe", "./assets/rockGrass.png");
        this.load.image("pauseButton", "./assets/pause.png");
        this.load.image("homeButton", "./assets/home.png");
    }
    create(){
        this.scene.start("MenuScene");
    }
    update(){

    }
}

export default PreloadScene;