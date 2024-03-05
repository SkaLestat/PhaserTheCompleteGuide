class BaseScene extends Phaser.Scene {
    constructor(key, config){
        super(key);
        this.config = config;
        this.screenCenter = [this.config.width/2, this.config.height/2];
        this.fontSize = 34;
        this.fontLineHeight = 42;
        this.fontOptions = {
            fontSize: `${this.fontSize}px`,
            color: "#CD00FF"
        }
    }

    create(){
        /* CreateBG */
        this.bg_1 = this.add.image(0, 0, "gameBg").setOrigin(0, 0).setDisplaySize(this.config.width, this.config.height);
        if(this.config.canGoBack){
            const homeButton = this.add.image(this.config.width -10, this.config.height -10, "homeButton")
            .setOrigin(1)
            .setScale(0.5)
            .setInteractive();

            homeButton.on("pointerup", () => {
                this.scene.start("MenuScene");
            });
        }
    }

    createMenu(menu, setupMenuEvents){
        let lastMenuPositionY = 0;
        menu.forEach(menuItem => {
            // const menuPosition = [...this.screenCenter];
            const menuPosition = [this.screenCenter[0], this.screenCenter[1] + lastMenuPositionY];
            menuItem.textGameObject = this.add.text(...menuPosition, menuItem.text, this.fontOptions)
            .setOrigin(0.5, 1);
            lastMenuPositionY += this.fontLineHeight;
            setupMenuEvents(menuItem);
        });
    }
}

export default BaseScene;