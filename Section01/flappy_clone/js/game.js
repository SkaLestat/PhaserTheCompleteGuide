import PlayScene from "./scenes/PlayScene.js";
import MenuScene from "./scenes/MenuScene.js";
import PreloadScene from "./scenes/PreloadScene.js";
import ScoreScene from "./scenes/ScoreScene.js";
import PauseScene from "./scenes/PauseScene.js";

const WIDTH = 800;
const HEIGHT = 600;
const INITIAL_POSITION = { x: WIDTH / 10, y: HEIGHT / 2 };
// const FLAP_VELOCITY = 250;
// const VELOCITY = 200;
// const PIPE_VERTICAL_DISTANCE_RANGE = [150, 200];
// const PIPE_HORIZONTAL_DISTANCE_RANGE = [450, 500];
// const INITIAL_PIPE_POSITION_X = 400;
// const MIN_PIPE_POSITION = 20;
// const PIPES_TO_RENDER = 4;
// const PIPES_VELOCITY = 200;
// let plane = null;
// let pipesGroup = null;
// let pipeHorizontalDistance = 0;
const SHARED_CONFIG = {
    width: WIDTH,
    height: HEIGHT,
    initialPosition: INITIAL_POSITION,
    defaultGameFont: "Courier",
    customGameFont: true
}

const SCENES = [
    PreloadScene,
    MenuScene,
    PlayScene,
    ScoreScene,
    PauseScene,
    // PlayScene, // EL ORDEN IMPORTA PARA PODER NAVEGAR EN LAS ESCENAS!!!
]

// const INIT_SCENES = () => SCENES.map((scene) => new scene(SHARED_CONFIG));
const CREATE_SCENE = scene => new scene(SHARED_CONFIG);
const INIT_SCENES = () => SCENES.map(CREATE_SCENE);

const PHASER_CONFIG = {
    /* WebGL (Web graphics library) JS Api for rendering 2D and 3D graphics */
    // type: Phaser.AUTO, // sobra?
    // width: 800,
    // height: 600,
    ...SHARED_CONFIG,
    physics: {
        /* Arcade physics plugin, manages physics simulation */
        default: "arcade",
        /* Global Gravity added to all Physics Objects */
        arcade: {
            // gravity: {y: 400},
            // debug: true
        }
    },
    // scene: [PlayScene],
    /* scene: {
        preload: preloadScene,
        create: createScene,
        update: updateScene
    }, */
    /* Short definition */
    /* scene: {
        preload,
        create,
        update
    } */
    /* scene: [
        PreloadScene,
        new MenuScene(SHARED_CONFIG),
        new PlayScene(SHARED_CONFIG)
    ], */
    scene: INIT_SCENES(),
    banner: {
        hidePhaser: true
    },
    pixelArt: true //Prevents blur in pixelart when scaled

};

/* Loading assets, such as images, music, animations ... */
function preloadScene() {
    /**
     * "this" context - scene
     * contains functions and properties we can use
     */
    // this.load.image("gameBg", "./assets/background.png");
    // this.load.image("plane", "./assets/planeRed1.png");
    // this.load.image("lowerPipe", "./assets/rockGrassDown.png");
    // this.load.image("upperPipe", "./assets/rockGrass.png");

}
function createScene() {
    /* Plane */
    // x, y, key
    // this.add.image(PHASER_CONFIG.width / 2 , PHASER_CONFIG.height / 2, "gameBg");
    // this.add.image(PHASER_CONFIG.width / 2 , PHASER_CONFIG.height / 2, "gameBg").setDisplaySize(PHASER_CONFIG.width, PHASER_CONFIG.height);
    // this.add.image(0, 0, "gameBg").setOrigin(0, 0).setDisplaySize(PHASER_CONFIG.width, PHASER_CONFIG.height);
    // plane = this.add.sprite(PHASER_CONFIG.width / 10 , PHASER_CONFIG.height / 2, "plane").setOrigin(0);
    // plane = this.physics.add.sprite(INITIAL_POSITION.x, INITIAL_POSITION.y, "plane").setOrigin(0);
    // plane.body.gravity.y = 400; // pixels per seconds
    /* Pipes */
    // pipesGroup = this.physics.add.group();
    // for (let i = 0; i < PIPES_TO_RENDER; i++) {
    //     const UPPER_PIPE = pipesGroup.create(0, 0, "upperPipe").setOrigin(0, 1).setDisplaySize(40, 480);
    //     const LOWER_PIPE = pipesGroup.create(0, 0, "lowerPipe").setOrigin(0).setDisplaySize(40, 480);
    //     placePipes(UPPER_PIPE, LOWER_PIPE);
    // }
    /* Inputs */
    // this.input.on("pointerdown", flap);
    // this.input.keyboard.on("keydown-SPACE", flap); // en versiones anteriores es keydown_SPACE

}
/**
 * 60FPS
 * 60 * 16ms = 1000ms
 * */
function updateScene(time, delta) {
    /**
     * time => total time
     * delta => time for the last frame
     */

    /* if(plane.x + plane.width >= PHASER_CONFIG.width){ // plane.x es lo mismo que plane.position.x
        plane.setFlipX(true);
        plane.body.velocity.x = -VELOCITY;
    } else if(plane.x <= 0){
        plane.setFlipX(false);
        plane.body.velocity.x = VELOCITY;
    } */
    /* if (plane.y + plane.height >= PHASER_CONFIG.height || plane.y <= 0) {
        restartPlayerPosition();
    }

    recyclePipes(); */
}
/* function flap() {
    plane.body.velocity.y = -FLAP_VELOCITY;
} */
/* function restartPlayerPosition() {
    plane.x = INITIAL_POSITION.x;
    plane.y = INITIAL_POSITION.y;
    plane.body.velocity.y = 0;
} */
/* function placePipes(upperPipe, lowerPipe){    
    const NEXT_PIPE_X = getNextPipeX();
    pipeHorizontalDistance = Phaser.Math.Between(...PIPE_HORIZONTAL_DISTANCE_RANGE);
    const PIPE_VERTICAL_DISTANCE = Phaser.Math.Between(...PIPE_VERTICAL_DISTANCE_RANGE); //destructuracion
    const PIPE_VERTICAL_POSITION = Phaser.Math.Between(0 + MIN_PIPE_POSITION, PHASER_CONFIG.height - MIN_PIPE_POSITION - PIPE_VERTICAL_DISTANCE);

    upperPipe.x = NEXT_PIPE_X + pipeHorizontalDistance;
    upperPipe.y = PIPE_VERTICAL_POSITION;
    lowerPipe.x = upperPipe.x;
    lowerPipe.y = upperPipe.y + PIPE_VERTICAL_DISTANCE;

    // upperPipe.body.velocity.x = -PIPES_VELOCITY;
    // lowerPipe.body.velocity.x = -PIPES_VELOCITY;
    pipesGroup.setVelocityX(-PIPES_VELOCITY);
} */
/* pipes pool */
/* function recyclePipes(){
    const TEMP_PIPES = [];
    pipesGroup.getChildren().forEach(pipe => {
        if(pipe.getBounds().right < 0){
            TEMP_PIPES.push(pipe);
            if(TEMP_PIPES.length === 2){
                placePipes(...TEMP_PIPES);
            }
        }
    });
} */
/* function getNextPipeX(){
    let rightMostX = 0;
    pipesGroup.getChildren().forEach(pipe => {
        rightMostX = Math.max(pipe.x, rightMostX);
    });
    return rightMostX;
} */

const PH_GAME = new Phaser.Game(PHASER_CONFIG);