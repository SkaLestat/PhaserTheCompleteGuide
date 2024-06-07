export class GameScene extends Phaser.Scene{
    isGameRunning = false;
    constructor(key){
        super(key);
    }

    get gameWidth() {
        return this.game.config.width;
    }
    get gameHeight() {
        return this.game.config.height;
    }
}