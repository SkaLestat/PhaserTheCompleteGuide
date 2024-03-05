import BaseScene from "./BaseScene.js";

class MenuScene extends BaseScene {
    constructor(config) {
        super("MenuScene", config);
        this.menu = [
            {
                scene: "PlayScene",
                text: "Play"
            },
            {
                scene: "ScoreScene",
                text: "Score"
            },
            {
                scene: null,
                text: "Exit"
            },
        ]
    }

    create() {
        super.create();
        // this.createMenu(this.menu, this.setupMenuEvents); // se pierde el contexto del this
        this.createMenu(this.menu, this.setupMenuEvents.bind(this));
    }

    setupMenuEvents(menuItem) {
        // console.log(this);
        const textGameObject = menuItem.textGameObject;
        textGameObject.setInteractive();
        textGameObject.on("pointerover", () => {
            textGameObject.setStyle({
                color: "#ff0"
            });
        });
        textGameObject.on("pointerout", () => {
            textGameObject.setStyle({
                color: "#CD00FF"
            });
        });
        textGameObject.on("pointerup", () => {
            menuItem.scene && this.scene.start(menuItem.scene);
            if(menuItem.text === "Exit"){
                this.game.destroy(true);
            }
        });
    }
}

export default MenuScene;