import { GameScene } from "./../scenes/gameScene.js";
import { Player } from "./../entities/player.js";
import { PRELOAD_CONFIG } from "../game.js";

class PlayScene extends GameScene {
    player;
    startTrigger;
    ground;
    // shouldStartRoll;
    // isGameRunning = false;
    spawnInterval = 1500;
    spawnTime = 0;
    obstacles;
    clouds;
    gameSpeed = 10;
    gameSpeedModifier = 1;
    gameOverText;
    restartText;
    gameOverContainer;
    scoreText;
    score = 0;
    highScoreText;
    scoreInterval = 100;
    scoreDeltaTime = 0;
    progressSound;

    constructor() {
        super("PlayScene");
    }

    create() {
        this.createEnviroment();
        this.createPlayer();
        this.createObstacles();
        this.createGameOverContainer();
        this.createScore();

        this.registerAnimations();

        this.handleGameStart();
        this.handleObstacleCollisions();
        this.handleGameRestart();

        this.progressSound = this.sound.add("progress", { volume: 1 });
    }
    update(time, delta) {
        // console.log(this.game.canvas.width)
        /* if(this.shouldStartRoll && this.ground.width < this.game.config.width){
            this.ground.width += 5;
        } */
        if (!this.isGameRunning) { return; }

        // console.log("T: " + time);
        // console.log("D: " + delta);
        this.spawnTime += delta;
        this.scoreDeltaTime += delta;
        if (this.spawnTime >= this.spawnInterval) {
            this.spawnObstacle();
            this.spawnTime = 0;
        }
        if (this.scoreDeltaTime >= this.scoreInterval) {
            this.score ++;
            if(this.score % 50 === 0){
                this.gameSpeedModifier += 0.2;
                this.progressSound.play();
                this.tweens.add({
                    targets: this.scoreText,
                    duration: 100,
                    repeat: 3,
                    alpha: 0,
                    // props: {
                    //     scale: 1.5,
                        
                    // },
                    // scale: 1.5,
                    yoyo: true
                });
            }
            this.scoreDeltaTime = 0;
        }

        Phaser.Actions.IncX(this.obstacles.getChildren(), -this.gameSpeed * this.gameSpeedModifier);
        Phaser.Actions.IncX(this.clouds.getChildren(), -0.5);
        
        const score = Array.from(String(this.score), Number);
        for(let i = 0; i < 5 - String(this.score).length; i++){
            score.unshift(0);
        }
        this.scoreText.setText(score.join(""));

        this.obstacles.getChildren().forEach(obstacle => {
            if (obstacle.getBounds().right < 0) {
                this.obstacles.remove(obstacle);
            }
        });
        this.clouds.getChildren().forEach(cloud => {
            if (cloud.getBounds().right < 0) {
                cloud.x = this.gameWidth + 30;
                cloud.y = Phaser.Math.Between(100, 170);
            }
        });
        this.ground.tilePositionX += this.gameSpeed * this.gameSpeedModifier;
    }
    createPlayer() {
        /* this.player = this.physics.add.sprite(0, this.game.config.height, "dino-idle")
            .setOrigin(0, 1); */
        /* this.player.setGravityY(500);
        this.player.setCollideWorldBounds(true); */
        /* this.player.setGravityY(5000)
            .setCollideWorldBounds(true)
            .setBodySize(44, 92); */
        // this.player = new Player(this, 0, this.gameHeight, "dino-idle"); // tiene problema en el primer salto por mostrar el sprite con el suelo al tiempo
        this.player = new Player(this, 0, this.gameHeight, "dino-run", 2);
    }
    createEnviroment() {
        this.ground = this.add.tileSprite(0, this.gameHeight, 88, 26, "ground")
            .setOrigin(0, 1);

        this.clouds = this.add.group(); // Crea grupo sin fisicas
        this.clouds.addMultiple([
            this.add.image(this.gameWidth / 2, Phaser.Math.Between(100, 170), "cloud"),
            this.add.image(this.gameWidth - 80, Phaser.Math.Between(100, 170), "cloud"),
            this.add.image(this.gameWidth / 1.3, Phaser.Math.Between(100, 170), "cloud"),
        ]);
        this.clouds.setAlpha();
    }

    /* registerPlayerControls() {
        const spaceBar = this.input.keyboard.addKey("SPACE");
        spaceBar.on("down", () => {
            this.player.setVelocityY(-1600);
        });
    } */
    spawnObstacle() {
        // const OBSTACLE_NUMBER = Math.floor(Math.random() * PRELOAD_CONFIG.cactusesCount) + 1;
        const OBSTACLE_NUMBER = Math.floor(Math.random() * PRELOAD_CONFIG.cactusesCount + PRELOAD_CONFIG.birdsCount) + 1;
        const DISTANCE = Phaser.Math.Between(150, 300);
        let obstacle;

        if(OBSTACLE_NUMBER > PRELOAD_CONFIG.cactusesCount){
            const enemyPosibleY = [20, 65];
            const enemyY = enemyPosibleY[Math.floor(Math.random() * 2)]; //genera un numero random entre 0 y 1
            obstacle = this.obstacles
                .create(this.gameWidth + DISTANCE, this.gameHeight - enemyY, "enemy-bird")
                .setBodySize(60, 25)
                .setOffset(25, 30);
            obstacle.play("enemy-bird-fly", true);
        } else{
            // const OBSTACLE = this.obstacles
            obstacle = this.obstacles
                .create(this.gameWidth + DISTANCE, this.gameHeight, `obstacle_${OBSTACLE_NUMBER}`);
                // .setOrigin(0, 1)
                // .setImmovable();
            // OBSTACLE.setImmovable(); // otra forma de setear Immovable
        }
        obstacle.setOrigin(0, 1).setImmovable();

    }

    createObstacles() {
        this.obstacles = this.physics.add.group();
    }

    createGameOverContainer() {
        this.gameOverText = this.add.image(0, 0, "game-over");
        this.restartText = this.add.image(0, 80, "restart")
            .setInteractive();
        /* Container for images */
        this.gameOverContainer = this.add.container(this.gameWidth / 2, (this.gameHeight / 2) - 50)
            .add([this.gameOverText, this.restartText])
            .setAlpha(0);
    }
    registerAnimations(){
        this.anims.create({
            key: "enemy-bird-fly",
            frames: this.anims.generateFrameNumbers("enemy-bird"),
            frameRate: 6,
            repeat: -1
        });
    }

    handleGameStart() {
        /* Empty Game Object For Collition Detect */
        this.startTrigger = this.physics.add.sprite(0, 10, null)
            .setOrigin(0, 1)
            .setAlpha(0); //Transparent Image;
        this.physics.add.overlap(this.startTrigger, this.player, () => {
            if (this.startTrigger.y === 10) {
                this.startTrigger.body.reset(0, this.gameHeight);
                return;
            }
            // if(this.startTrigger.y === this.game.config.height){
            //     console.log("segunda collision")
            // }
            /* Iniciar juego */
            this.startTrigger.body.reset(9999, 9999);
            // this.shouldStartRoll = true;
            const rollOutEvent = this.time.addEvent({
                delay: 1000 / 60, // 60fps
                callback: () => {
                    /* if(this.ground.width < this.game.config.width){
                        this.ground.width += 34;
                    } */
                    this.player.setVelocityX(80);
                    this.player.playRunAnimation();
                    this.ground.width += 34;
                    if (this.ground.width >= this.gameWidth) {
                        rollOutEvent.remove();
                        this.ground.width = this.gameWidth;
                        this.player.setVelocityX(0);
                        this.clouds.setAlpha(1);
                        this.scoreText.setAlpha(1);
                        this.isGameRunning = true;
                    }
                },
                loop: true
            });
        });
    }

    handleGameRestart() {
        this.restartText.on("pointerdown", (pointer, currentlyOver) => {
            console.log("restart");
            this.physics.resume();
            this.player.setVelocityY(0);
            this.obstacles.clear(true, true);
            this.gameOverContainer.setAlpha(0);
            this.highScoreText.setAlpha(0);
            this.anims.resumeAll();
            this.isGameRunning = true;
        });
    }

    handleObstacleCollisions() {
        // this.registerPlayerControls();
        this.physics.add.collider(this.obstacles, this.player, () => {
            /* Pause Physics */
            this.isGameRunning = false;
            this.physics.pause();
            this.anims.pauseAll();
            this.player.die();
            this.gameOverContainer.setAlpha(1);
            const newHighScore = this.highScoreText.text.substring(this.highScoreText.text.length - 5);
            const newScore = Number(this.scoreText.text) > Number(newHighScore) ? this.scoreText.text : newHighScore;
            this.highScoreText.setText(`HI ${newScore}`);
            this.highScoreText.setAlpha(1);
            /* Reset Values */
            this.spawnTime = 0;
            this.score = 0;
            this.scoreDeltaTime = 0;
            // this.gameSpeed = 10;
            this.gameSpeedModifier = 1;
        });
    }

    createScore(){
        this.scoreText = this.add.text(this.gameWidth, 0, "00000", {
            fontSize: 30,
            fontFamily: "Arial",
            color: "#535353",
            resolution: 5
        }).setOrigin(1, 0)
        .setAlpha(0);

        this.highScoreText = this.add.text(this.scoreText.getBounds().left - 20, 0, "00000", {
            fontSize: 30,
            fontFamily: "Arial",
            color: "#535353",
            resolution: 5
        }).setOrigin(1, 0)
        .setAlpha(0);
    }

}

export default PlayScene;

/* sprite y tileSPrite */
/**
 * Mientras que un Sprite se utiliza para representar elementos únicos
 * en el juego, como personajes o objetos estáticos, un TileSprite se emplea
 * para crear fondos repetitivos sin consumir excesivos recursos de memoria.
 */

/* Cambiar color con tweens */
/* this.tweens.add({
    targets: this.scoreText,
    duration: 100,
    repeat: 3,
    alpha: 0,
    yoyo: true,
    scaleX: 2, // Add scaling for width
    onUpdate: function (tween) {
      const value = tween.getValue();
      const color = Phaser.Display.Color.Interpolate.ColorWithColor(
        new Phaser.Display.Color(255, 255, 255), // Start color (white)
        new Phaser.Display.Color(255, 0, 0), // End color (red)
        100,
        value
      );
   
      const colorString = Phaser.Display.Color.RGBToString(
        Math.floor(color.r),
        Math.floor(color.g),
        Math.floor(color.b),
        0,
        '#'
      );
   
      tween.targets[0].setStyle({ fill: colorString });
    }
  }); */