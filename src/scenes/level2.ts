import Phaser from "phaser";

export default class level2 extends Phaser.Scene {
    private monkeys: Array<string>;
    private monkey: Phaser.GameObjects.Image;
    private help: Phaser.GameObjects.Image;
    private popup: Phaser.GameObjects.Image;
    private flag: boolean;
    private title: Phaser.GameObjects.Text;
    private p1: Phaser.GameObjects.Text;
    private p2: Phaser.GameObjects.Text;
    private destroy: Phaser.GameObjects.Text;
    private container: Phaser.GameObjects.Container;
    private back: Phaser.GameObjects.Image;
    private correct: Phaser.Sound.BaseSound;

    constructor() {
        super({ key: "level2" });
        this.monkeys = ["brown-pirate hat", "blue-hatless", "yellow-party hat"];
    }

    preload() {
        this.load.image("background", "assets/img/background.png");
        this.load.image("back", "assets/img/back-button.png");
        this.load.image(
            "brown-pirate hat",
            "assets/img/monkeys/monkey-brown-pirate.png"
        );
        this.load.image(
            "blue-hatless",
            "assets/img/monkeys/monkey-blue-hatless.png"
        );
        this.load.image(
            "yellow-party hat",
            "assets/img/monkeys/monkey-yellow-party.png"
        );
        this.load.image("help", "assets/img/help-64.png");
        this.load.image("popup", "assets/img/popup.png");
        this.load.audio("correct", "assets/audio/correct-choice.mp3");
    }

    create() {
        //background + header
        this.add.image(350, 360, "background");
        this.add.rectangle(640, 0, 1280, 150, 0x0000);

        this.add.text(545, 10, "Level 2", {
            fontSize: "48px",
        });
        
        this.correct = this.sound.add("correct", { loop: false });

        //help button
        this.help = this.add.image(50, 35, "help").setInteractive();
        this.help.setAlpha(0.7);
        this.flag = true;

        this.help.on("pointerover", () => {
            this.help.setAlpha(1);
        });
        this.help.on("pointerout", () => {
            this.help.setAlpha(0.7);
        });
        this.help.on("pointerup", () => {
            if (this.flag) {
                this.flag = false;
                this.generatePopUp();
            }
        });

        //back button
        this.back = this.add.image(130, 33, "back").setInteractive();
        this.back.scale = 0.3;
        this.back.setAlpha(0.7);

        this.back.on("pointerover", () => {
            this.back.setAlpha(1);
        });
        this.back.on("pointerout", () => {
            this.back.setAlpha(0.7);
        });
        this.back.on("pointerup", () => {
            this.scene.stop("level2").launch("titleScene");
        });

        //side boxes
        this.add.rectangle(1000, 250, 600, 350, 0xffff);
        this.add.rectangle(1000, 650, 600, 450, 0x9999);

        this.add.image(350, 325, "brown-pirate");
        this.input.setDraggable(
            this.add
                .text(720, 500, "brown", { fontSize: "42px" })
                .setInteractive(),
            true
        );
        this.input.setDraggable(
            this.add
                .text(1000, 500, "blue", { fontSize: "42px" })
                .setInteractive(),
            true
        );
        this.input.setDraggable(
            this.add
                .text(720, 550, "pirate hat", { fontSize: "42px" })
                .setInteractive(),
            true
        );
        this.input.setDraggable(
            this.add
                .text(1000, 550, "yellow", { fontSize: "42px" })
                .setInteractive(),
            true
        );
        this.input.setDraggable(
            this.add
                .text(720, 600, "hatless", { fontSize: "42px" })
                .setInteractive(),
            true
        );
        this.input.setDraggable(
            this.add
                .text(1000, 600, "party hat", { fontSize: "42px" })
                .setInteractive(),
            true
        );

        //default monkey
        this.monkey = this.add.image(350, 325, this.monkeys[0]);

        this.add.text(720, 100, "class Monkey:", {
            fontSize: "42px",
            color: "black",
        });
        this.add.text(750, 175, "color:", {
            fontSize: "32px",
            color: "black",
        });
        this.add.text(750, 250, "hat:", {
            fontSize: "32px",
            color: "black",
        });

        //drop zones
        const dropZoneColor: Phaser.GameObjects.Zone = this.add
            .zone(950, 196, 150, 50)
            .setRectangleDropZone(150, 50)
            .setInteractive();
        const dropZoneHat: Phaser.GameObjects.Zone = this.add
            .zone(950, 270, 150, 50)
            .setRectangleDropZone(150, 50)
            .setInteractive();

        const graphics = this.add.graphics();
        graphics.lineStyle(2, 0xffff00);
        if (dropZoneColor.input) {
            graphics.strokeRect(
                dropZoneColor.x - dropZoneColor.input.hitArea.width / 2,
                dropZoneColor.y - dropZoneColor.input.hitArea.height / 2,
                dropZoneColor.input.hitArea.width,
                dropZoneColor.input.hitArea.height
            );
        }
        if (dropZoneHat.input) {
            graphics.strokeRect(
                dropZoneHat.x - dropZoneHat.input.hitArea.width / 2,
                dropZoneHat.y - dropZoneHat.input.hitArea.height / 2,
                dropZoneHat.input.hitArea.width,
                dropZoneHat.input.hitArea.height
            );
        }

        let flag: boolean = false;
        let temp: Phaser.GameObjects.Text | null = null;

        //drag and drop
        this.input.on(
            "drag",
            (
                pointer: Phaser.Input.Pointer,
                gameObject: { x: number; y: number },
                dragX: number,
                dragY: number
            ) => {
                gameObject.x = dragX;
                gameObject.y = dragY;
            }
        );

        this.input.on(
            "dragenter",
            (
                pointer: Phaser.Input.Pointer,
                gameObject: Phaser.GameObjects.Text,
                dropZone: Phaser.GameObjects.Zone
            ) => {
                graphics.clear();
                graphics.lineStyle(2, 0x00ffff);
                if (dropZone.input) {
                    graphics.strokeRect(
                        dropZone.x - dropZone.input.hitArea.width / 2,
                        dropZone.y - dropZone.input.hitArea.height / 2,
                        dropZone.input.hitArea.width,
                        dropZone.input.hitArea.height
                    );
                }
            }
        );

        this.input.on(
            "dragleave",
            (
                pointer: Phaser.Input.Pointer,
                gameObject: Phaser.GameObjects.Text,
                dropZone: Phaser.GameObjects.Zone
            ) => {
                graphics.clear();
                graphics.lineStyle(2, 0xffff00);
                if (dropZone.input) {
                    graphics.strokeRect(
                        dropZone.x - dropZone.input.hitArea.width / 2,
                        dropZone.y - dropZone.input.hitArea.height / 2,
                        dropZone.input.hitArea.width,
                        dropZone.input.hitArea.height
                    );
                }
            }
        );

        this.input.on(
            "drop",
            (
                _pointer: Phaser.Input.Pointer,
                gameObject: Phaser.GameObjects.Text,
                dropZone: Phaser.GameObjects.Zone
            ) => {
                gameObject.x = dropZone.x - 50;
                gameObject.y = dropZone.y - 25;

                let monkeyVals: Array<string> = this.getMonkeyVals();

                if (
                    (gameObject.text == monkeyVals[0] &&
                        dropZone == dropZoneColor) ||
                    (gameObject.text == monkeyVals[1] &&
                        dropZone == dropZoneHat)
                ) {
                    gameObject.setColor("green");
                    this.correct.play();
                    if (!flag) {
                        flag = true;
                        temp = gameObject;
                    } else {
                        if (gameObject.input && temp) {
                            gameObject.destroy();
                            temp.destroy();
                            this.changeMonkey();
                            flag = false;
                        }
                    }
                    graphics.clear();
                    graphics.lineStyle(2, 0xffff00);
                    if (dropZone.input) {
                        graphics.strokeRect(
                            dropZone.x - dropZone.input.hitArea.width / 2,
                            dropZone.y - dropZone.input.hitArea.height / 2,
                            dropZone.input.hitArea.width,
                            dropZone.input.hitArea.height
                        );
                    }
                }
            }
        );

        this.input.on(
            "dragend",
            (
                _pointer: Phaser.Input.Pointer,
                gameObject: Phaser.GameObjects.Text,
                dropped: boolean
            ) => {
                if (!dropped) {
                    if (gameObject.input) {
                        gameObject.x = gameObject.input.dragStartX;
                        gameObject.y = gameObject.input.dragStartY;
                    }
                }

                graphics.clear();
                graphics.lineStyle(2, 0xffff00);
                if (dropZoneColor.input) {
                    graphics.strokeRect(
                        dropZoneColor.x - dropZoneColor.input.hitArea.width / 2,
                        dropZoneColor.y -
                            dropZoneColor.input.hitArea.height / 2,
                        dropZoneColor.input.hitArea.width,
                        dropZoneColor.input.hitArea.height
                    );
                }
                if (dropZoneHat.input) {
                    graphics.strokeRect(
                        dropZoneHat.x - dropZoneHat.input.hitArea.width / 2,
                        dropZoneHat.y - dropZoneHat.input.hitArea.height / 2,
                        dropZoneHat.input.hitArea.width,
                        dropZoneHat.input.hitArea.height
                    );
                }
            }
        );

        this.generatePopUp();
    }

    generatePopUp() {
        this.popup = this.add
            .image(225, 125, "popup")
            .setOrigin(0)
            .setScale(1.25);
        this.title = this.add.text(
            290,
            200,
            "Welcome to Level 1 of Jungle Quest!",
            {
                fontSize: "32px",
                color: "black",
            }
        );
        this.p1 = this.add.text(
            290,
            275,
            "In this level, we want to fill in the Monkey class's field values based on the appearance of the monkey on the left of the screen.",
            {
                fontSize: "16px",
                color: "black",
                align: "center",
                wordWrap: { width: 700, useAdvancedWrap: true },
            }
        );
        this.p2 = this.add.text(
            290,
            350,
            "Fill in the blanks by dragging the correct descriptive word. If you make a mistake, click the back button to return to the main menu and try again.",
            {
                fontSize: "16px",
                color: "black",
                align: "center",
                wordWrap: { width: 700, useAdvancedWrap: true },
            }
        );
        this.destroy = this.add
            .text(575, 450, "CLOSE", {
                fontSize: "32px",
                color: "blue",
                align: "center",
            })
            .setInteractive();

        this.destroy.on("pointerover", () => {
            this.destroy.setColor("yellow");
        });
        this.destroy.on("pointeroff", () => {
            this.destroy.setColor("blue");
        });
        this.destroy.on("pointerup", () => {
            this.container.destroy();
            this.flag = true;
        });

        this.container = this.add.container(0, 0, [
            this.popup,
            this.title,
            this.p1,
            this.p2,
            this.destroy,
        ]);
    }

    changeMonkey() {
        let index: number = this.monkeys.indexOf(this.monkey.texture.key) + 1;
        if (index < 3) {
            this.monkey.destroy();
            this.monkey = this.add.image(350, 325, this.monkeys[index]);
        } else {
            this.popup = this.add
                .image(225, 125, "popup")
                .setOrigin(0)
                .setScale(1.25);
            this.title = this.add.text(
                290,
                200,
                "Congrats! You did it! Great job!",
                {
                    fontSize: "32px",
                    color: "black",
                }
            );
            this.p1 = this.add.text(
                290,
                275,
                "The next level hasn't been implemented yet, so click NEXT to go to Level2.",
                {
                    fontSize: "16px",
                    color: "black",
                    align: "center",
                    wordWrap: { width: 700, useAdvancedWrap: true },
                }
            );
            this.destroy = this.add
                .text(575, 450, "NEXT", {
                    fontSize: "32px",
                    color: "blue",
                    align: "center",
                })
                .setInteractive();

            this.destroy.on("pointerover", () => {
                this.destroy.setColor("yellow");
            });
            this.destroy.on("pointeroff", () => {
                this.destroy.setColor("blue");
            });
            this.destroy.on("pointerup", () => {
                this.container.destroy();
                this.scene.stop("level1").launch("level2");
            });

            this.container = this.add.container(0, 0, [
                this.popup,
                this.title,
                this.p1,
                this.destroy,
            ]);
        }
    }

    getMonkeyVals() {
        let key: string = this.monkey.texture.key;
        return key.split("-");
    }

    update() {}
}
