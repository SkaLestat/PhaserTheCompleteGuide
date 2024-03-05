import BaseScene from "./BaseScene.js";

class PlayScene extends BaseScene {
    constructor(config) {
        super("PlayScene", config);
        this.flapVelocity = 300;
        this.initialPosition = { x: this.config.width / 50, y: this.config.height / 2 };
        // this.pipeVerticalDistanceRange = [150, 200];
        // this.pipeHorizontalDistanceRange = [450, 500];
        this.minPipePosition = 20;
        this.pipesToRender = 4;
        this.pipesVelocity = 200;
        this.plane = null;
        this.pipesGroup = null;
        this.planeGravity = 600;
        this.score = 0;
        this.scoreText = "";
        this.scoreConfig = {
            x: 16,
            y: 16,
            textConfig: {
                fontSize: "32px",
                color: "#000",
                fontFamily: this.config.customGameFont ? "gameFont" : this.config.defaultGameFont
            },
            string: "Score:",
        };
        this.bestScoreConfig = {
            x: 16,
            y: 56,
            textConfig: {
                fontSize: "22px",
                color: "#000",
                fontFamily: this.config.customGameFont ? "gameFont" : this.config.defaultGameFont
            },
            string: "Best Score:",
        };
        this.validateScore = true;
        this.isPaused = false;
        this.difficulties = {
            "easy": {
                pipeHorizontalDistanceRange: [450, 500],
                pipeVerticalDistanceRange: [150, 200]
            },
            "normal": {
                pipeHorizontalDistanceRange: [280, 330],
                pipeVerticalDistanceRange: [140, 190]
            },
            "hard": {
                pipeHorizontalDistanceRange: [250, 310],
                pipeVerticalDistanceRange: [120, 170]
            },
        };
        this.currentDifficulty = "easy";
        this.bgVelocity = 150;
    }
    preload() {
        /**
         * "this" context - scene
         * contains functions and properties we can use
         */
        /* this.load.image("gameBg", "./assets/background.png");
        this.load.image("plane", "./assets/planeRed1.png");
        this.load.image("lowerPipe", "./assets/rockGrassDown.png");
        this.load.image("upperPipe", "./assets/rockGrass.png");
        this.load.image("pauseButton", "./assets/pause.png"); */
        this.score = 0;
    }
    create() {
        this.currentDifficulty = "easy";
        super.create();
        this.createBG();
        this.createPlane();
        this.createPipes();
        this.createScore();
        this.createPause();
        this.createColliders();
        this.handleInputs();
        this.listenToEvents();
        /* Animation */
        this.anims.create({
            key: "fly",
            // frames: this.anims.generateFrameNumbers("plane", {
            //     start: 2,
            //     end: 4
            // }),
            frames: [
                {
                    key: "plane",
                    frame: 1
                },
                {
                    key: "plane",
                    frame: 9
                },
                {
                    key: "plane",
                    frame: 12
                }
            ],
            frameRate: 8,
            repeat: -1
        });
        this.plane.play("fly");
    }
    update() {
        this.checkGameEvents();
        this.recyclePipes();
        this.restartBG();
    }
    listenToEvents() {
        if (this.pauseEvent) { return; }
        this.pauseEvent = this.events.on("resume", () => {
            this.countDownEvent && this.countDownEvent.remove(); //custom
            if (this.countDownText && this.countDownText.text != "") {
                this.countDownText.setText("");
            }
            this.countDownSeconds = 3;
            // this.countDownText = this.add.text(...this.screenCenter, `Fly in: ${this.countDownSeconds}`, this.fontOptions)
            //     .setOrigin(0.5);
            this.countDownText.setText(`Fly in: ${this.countDownSeconds}`);
            this.countDownEvent = this.time.addEvent({
                delay: 1000,
                callback: this.countDownHandler,
                callbackScope: this,
                loop: true
            });
        });
    }
    countDownHandler() {
        this.countDownSeconds--;
        this.countDownText.setText(`Fly in: ${this.countDownSeconds}`);
        if (this.countDownSeconds <= 0) {
            this.isPaused = false;
            this.countDownText.setText("");
            this.physics.resume();
            this.countDownEvent.remove();
        }
    }
    /* createBG() {
        this.add.image(0, 0, "gameBg").setOrigin(0, 0).setDisplaySize(this.config.width, this.config.height);
    } */
    createBG() {
        // this.bg_1.destroy();
        // The main difference between an Arcade Image and an Arcade Sprite is that you cannot animate an Arcade Image.
        this.bg_2 = this.physics.add.image(this.config.width, 0, "gameBg")
        .setOrigin(0, 0)
        .setDisplaySize(this.config.width, this.config.height);
        this.physics.add.existing(this.bg_1);
        this.bg_1.body.velocity.x = -this.bgVelocity;
        this.bg_2.body.velocity.x = -this.bgVelocity;
    }
    restartBG(){
        if(this.bg_1.getBounds().right <= 0){
            console.log(this.bg_1.getBounds().right)
            console.log(this.bg_1.x)
            this.bg_1.x = this.config.width + this.bg_1.getBounds().right;
        }
        if(this.bg_2.getBounds().right <= 0){
            this.bg_2.x = this.config.width + this.bg_2.getBounds().right;
        }
    }
    createPlane() {
        this.plane = this.physics.add.sprite(this.initialPosition.x, this.initialPosition.y, "plane")
            .setOrigin(0)
            // .setFlip(true)
            .setImmovable(true);
        /* Ajuste Caja Colision */
        this.plane.setBodySize(this.plane.width, this.plane.height - 10);

        this.plane.body.gravity.y = this.planeGravity; // pixels per seconds
        this.plane.setCollideWorldBounds(true);
    }
    createPipes() {
        /* Pipes */
        this.pipesGroup = this.physics.add.group();
        for (let i = 0; i < this.pipesToRender; i++) {
            const UPPER_PIPE = this.pipesGroup
                .create(0, 0, "upperPipe")
                .setImmovable(true)
                .setOrigin(0, 1)
                .setDisplaySize(40, 480);
            const LOWER_PIPE = this.pipesGroup
                .create(0, 0, "lowerPipe").setOrigin(0)
                .setImmovable(true)
                .setDisplaySize(40, 480);
            this.placePipes(UPPER_PIPE, LOWER_PIPE);
        }
    }
    createColliders() {
        this.physics.add.collider(this.plane, this.pipesGroup, this.gameOver, null, this);
    }
    createScore() {
        // this.score = 0;
        this.scoreText = this.add.text(this.scoreConfig.x, this.scoreConfig.y, `${this.scoreConfig.string} ${this.score}`, this.scoreConfig.textConfig);
        this.add.text(this.bestScoreConfig.x, this.bestScoreConfig.y, `${this.bestScoreConfig.string} ${localStorage.getItem("bestScore") || 0}`, this.bestScoreConfig.textConfig);
    }
    createPause() {
        this.isPaused = false;
        const pauseButton = this.add.image(this.config.width - 10, this.config.height - 10, "pauseButton")
            .setOrigin(1, 1)
            // .setDisplaySize(50, 50);;
            .setScale(0.5)
            .setInteractive();
        pauseButton.on("pointerdown", () => {
            this.isPaused = true;
            this.physics.pause();
            this.scene.pause(); //stops de update function
            this.scene.launch("PauseScene"); //launch works in parallel with the current scene, start shutdowns  the current scene
        });
        this.countDownText = this.add.text(...this.screenCenter, "", this.fontOptions)
            .setOrigin(0.5); //custom
    }
    handleInputs() {
        /* Inputs */
        this.input.on("pointerdown", this.flap, this);
        this.input.keyboard.on("keydown-SPACE", this.flap, this); // en versiones anteriores es keydown_SPACE
    }
    checkGameEvents() {
        if (this.plane.getBounds().bottom >= this.config.height || this.plane.y <= 0) {
            this.gameOver();
        }
    }
    flap() {
        if (this.isPaused) { return; }
        this.plane.body.velocity.y = -this.flapVelocity;
    }
    increaseScore() {
        this.score++;
        this.scoreText.setText(`${this.scoreConfig.string} ${this.score}`);
    }
    saveBestScore() {
        const BEST_SCORE_TEXT = localStorage.getItem("bestScore");
        const BEST_SCORE = BEST_SCORE_TEXT && parseInt(BEST_SCORE_TEXT, 10);
        if (!BEST_SCORE || this.score > BEST_SCORE) {
            localStorage.setItem("bestScore", this.score);
        }
    }
    gameOver() {
        this.physics.pause();
        this.plane.setTint(0xEE4824);

        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.scene.restart();
            },
            loop: false
        });
    }
    placePipes(upperPipe, lowerPipe) {
        const difficulty = this.difficulties[this.currentDifficulty];
        const nextPipeX = this.getNextPipeX();
        this.pipeHorizontalDistance = Phaser.Math.Between(...difficulty.pipeHorizontalDistanceRange);
        const pipeVerticalDistance = Phaser.Math.Between(...difficulty.pipeVerticalDistanceRange); //destructuracion
        const pipeVerticalPosition = Phaser.Math.Between(0 + this.minPipePosition, this.config.height - this.minPipePosition - pipeVerticalDistance);

        upperPipe.x = nextPipeX + this.pipeHorizontalDistance;
        upperPipe.y = pipeVerticalPosition;
        lowerPipe.x = upperPipe.x;
        lowerPipe.y = upperPipe.y + pipeVerticalDistance;

        this.pipesGroup.setVelocityX(-this.pipesVelocity);
    }
    /* pipes pool */
    recyclePipes() {
        const TEMP_PIPES = [];
        this.pipesGroup.getChildren().forEach(pipe => {
            /* Update Score */
            if (pipe.getBounds().right < this.plane.getBounds().left && this.validateScore == true) {
                this.increaseScore();
                this.validateScore = false;
                this.saveBestScore();
                this.increaseDifficulty();
            }
            if (pipe.getBounds().right < 0) {
                TEMP_PIPES.push(pipe);
                if (TEMP_PIPES.length === 2) {
                    this.validateScore = true;
                    this.placePipes(...TEMP_PIPES);
                    // this.increaseScore();
                }
            }
        });
    }
    increaseDifficulty() {
        if (this.score >= 10 && this.score < 20) {
            this.currentDifficulty = "normal";
        } else if (this.score >= 20) {
            this.currentDifficulty = "hard";
        }
    }
    getNextPipeX() {
        let rightMostX = 0;
        this.pipesGroup.getChildren().forEach(pipe => {
            rightMostX = Math.max(pipe.x, rightMostX);
        });
        return rightMostX;
    }
}

export default PlayScene;