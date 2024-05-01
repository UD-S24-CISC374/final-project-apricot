import Phaser from "phaser";

export default class Collectables extends Phaser.GameObjects.Container {
    private menu: Phaser.GameObjects.Image;
    private close: Phaser.GameObjects.Text;
    private box: Phaser.GameObjects.Container;

    constructor(scene: Phaser.Scene){
        super(scene);
        this.scene.add.existing(this);
    }

    generateMenu(collectables: Record<string, boolean>){
        this.menu = this.scene.add
            .image(225, 125, "popup")
            .setOrigin(0)
            .setScale(1.25);

        this.close = this.scene.add
            .text(575, 450, "CLOSE", {
                fontSize: "32px",
                color: "blue",
                align: "center",
            })
            .setInteractive();
        this.close.on("pointerover", () => {
            this.close.setColor("yellow");
        });
        this.close.on("pointeroff", () => {
            this.close.setColor("blue");
        });
        this.close.on("pointerup", () => {
            this.box.destroy();
        });

        this.box = this.scene.add.container(0, 0, [this.menu, this.close]);

        let x = 350;
        let y = 250;

        Object.entries(collectables).forEach((object) => {
            if(object[1]){
                this.box.add(this.scene.add.image(x, y, object[0]).setScale(0.4));
                x += 200;
                if (x > 750) {
                    x = 350;
                    y += 100;
                }
            }
        });
        this.box.update();
    }


}