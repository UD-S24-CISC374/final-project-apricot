import Phaser from "phaser";
import factsJson from "../objects/facts.json";

export default class Collectables extends Phaser.GameObjects.Container {
    private menu: Phaser.GameObjects.Image;
    private close: Phaser.GameObjects.Text;
    private box: Phaser.GameObjects.Container;
    private fact: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene) {
        super(scene);
        this.scene.add.existing(this);
    }

    generateFact(collectable: string) {
        factsJson.forEach((index: {object: string, facts: Array<string>}) => {
            if (index.object == collectable){
                this.fact.setText(index.facts[Math.floor(Math.random() * index.facts.length)]);
            }
        });
    }

    generateMenu(collectables: Record<string, boolean>) {
        this.menu = this.scene.add
            .image(225, 125, "popup")
            .setOrigin(0)
            .setScale(1.25);

        this.fact = this.scene.add.text(300, 450, "Click on any of your collectables to hear a fun fact! If you don't have any collectables, try interacting with animals and objects in the game levels.", {
            fontSize: "16px",
            color: "black",
            align: "center",
            wordWrap: { width: 700, useAdvancedWrap: true },
        });

        this.close = this.scene.add
            .text(575, 550, "CLOSE", {
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

        this.box = this.scene.add.container(0, 0, [this.menu, this.close, this.fact]);

        let x = 350;
        let y = 250;

        Object.entries(collectables).forEach((object) => {
            if (object[1]) {
                this.box.add(
                    this.scene.add
                        .image(x, y, object[0])
                        .setScale(0.4)
                        .setInteractive()
                        .on("pointerup", () => {
                            this.generateFact(object[0]);
                        })
                );
                x += 200;
                if (x > 750) {
                    x = 350;
                    y += 100;
                }
            }
        });
    }
}