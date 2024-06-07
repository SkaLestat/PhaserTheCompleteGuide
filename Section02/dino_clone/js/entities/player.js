// import { GameScene } from "../scenes/gameScene.js"; // necesario en .ts para hacer el cast de scene:GameScene

export class Player extends Phaser.Physics.Arcade.Sprite {
    cursors;
    jumpSound;
    hitSound;

    constructor(scene, x, y, key, frame) {
        super(scene, x, y, key, frame);
        /* Registrar game object en la escena */
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.init();
        /* Reaccionar al evento update de la escena */
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

    init() {
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.setOrigin(0, 1)
            .setGravityY(5000)
            .setCollideWorldBounds(true)
            .setBodySize(44, 92)
            .setOffset(20, 0)
            .setDepth(1);
        // this.registerPlayerControls();
        this.registerAnimations();
        this.registerSounds();
    }

    /* registerPlayerControls() {
        const spaceBar = this.scene.input.keyboard.addKey("SPACE");
        spaceBar.on("down", () => {
            this.setVelocityY(-1600);
        });
    } */

    update() {
        const up = this.cursors.up;
        const down = this.cursors.down;
        const isSpaceJustDown = Phaser.Input.Keyboard.JustDown(up);
        const isDownJustDown = Phaser.Input.Keyboard.JustDown(down);
        const isDownJustUp = Phaser.Input.Keyboard.JustUp(down);
        const onFloor = this.body.onFloor();
        if (isSpaceJustDown && onFloor) {
            this.setVelocityY(-1600);
            if(this.scene.isGameRunning){ this.jumpSound.play(); }
        }
        if (isDownJustDown && onFloor) {
            this.body.setSize(this.body.width, 58);
            this.setOffset(60, 34);
        }
        if (isDownJustUp && onFloor) {
            this.body.setSize(44, 92);
            this.setOffset(20, 0);
        }
        if (!this.scene.isGameRunning) { return }
        // console.log(this.body.deltaAbsY());
        // console.log(this.body.y);
        // console.log(this.body.deltaY());
        // if(this.body.deltaAbsY() > 1.39){ // por alguna razon no me da exacto con el tutorial
        if (this.body.y < 248) {
            this.anims.stop();
            this.setTexture("dino-run", 0);
        } else {

            this.playRunAnimation();
        }
    }

    registerAnimations() {
        this.anims.create({
            key: "dino-running",
            // frames: this.anims.generateFrameNumbers("dino-run"),
            frames: this.anims.generateFrameNumbers("dino-run", {
                start: 2,
                ende: 3
            }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "dino-down",
            frames: this.anims.generateFrameNumbers("dino-down"),
            frameRate: 10,
            repeat: -1
        });
    }
    
    registerSounds(){
        this.jumpSound = this.scene.sound.add("jump",
            {
                volume: 1
            }
        );
        this.hitSound = this.scene.sound.add("hit",
            {
                volume: 1
            }
        );
    }

    playRunAnimation() {
        this.body.height <= 58 ? 
            this.play("dino-down", true):
            this.play("dino-running", true);
    }

    die(){
        this.hitSound.play();
        this.anims.pause();
        this.setTexture("dino-hurt");
    }
}
// default Player;