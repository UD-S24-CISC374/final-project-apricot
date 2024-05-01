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
    private index : number;
    private isHat: boolean;
    private options: Array<Phaser.GameObjects.Text>;

    constructor() {
        super({ key: "level2" });
        this.monkeys = ["brown-pirate hat", "blue-hatless", "yellow-party hat"];
        this.index = 0;
        this.isHat = false;
        this.options = [];
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
        const origin: Record<string, { x: number; y: number }> = {
            "brown": { x: 720, y: 500 },
            "blue": { x: 1000, y: 500 },
            "pirate hat": { x: 720, y: 550 },
            "yellow": { x: 1000, y: 550 },
            "hatless": { x: 720, y: 600 },
            "party hat": { x: 1000, y: 600 }
        };
        let brown = this.add.text(720, 500, "brown", { fontSize: "42px" }).setInteractive();
        let pirateHat = this.add.text(720, 550, "pirate hat", { fontSize: "42px" }).setInteractive();
        let blue = this.add.text(1000, 500, "blue", { fontSize: "42px" }).setInteractive();
        let yellow = this.add.text(1000, 550, "yellow", { fontSize: "42px" }).setInteractive();
        let hatless = this.add.text(720, 600, "hatless", { fontSize: "42px" }).setInteractive();
        let partyHat = this.add.text(1000, 600, "party hat", { fontSize: "42px" }).setInteractive();
        this.options = [brown, blue, pirateHat, yellow, hatless, partyHat];
        this.input.setDraggable(brown,true);
        this.input.setDraggable(blue,true);
        this.input.setDraggable(pirateHat,true);
        this.input.setDraggable(yellow,true);
        this.input.setDraggable(hatless,true);
        this.input.setDraggable(partyHat,true);

        //default monkey
        this.monkey = this.add.image(350, 325, this.monkeys[0]);

        this.add.text(720, 100, "if(monkey.hat == 'pirate hat'){", {
            fontSize: "24px",
            color: "black",
        });
        let ifStatement = this.add.text(770, 150, "this.color = ", {
            fontSize: "22px",
            color: "black",
        });
        this.add.text(725, 190, "}", {
            fontSize: "24px",
            color: "black",
        });
        let elseIfStatement = this.add.text(720, 230, "else if(monkey.color == 'blue'){", {
            fontSize: "24px",
            color: "black",
        });
        this.add.text(770, 280, "this.hat = ", {
            fontSize: "24px",
            color: "black",
        });
        this.add.text(725, 320, "}", {
            fontSize: "24px",
            color: "black",
        });
        let elseStatement = this.add.text(720, 360, "else{", {
            fontSize: "24px",
            color: "black",
        });

        //drop zones
        const dropZoneColor: Phaser.GameObjects.Zone = this.add
            .zone(1010, 165, 150, 50)
            .setRectangleDropZone(250, 50)
            .setInteractive();
        const dropZoneHat: Phaser.GameObjects.Zone = this.add
            .zone(1010, 290, 150, 50)
            .setRectangleDropZone(250, 50)
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
                    (gameObject.text == monkeyVals[this.index] && dropZone == dropZoneColor && !this.isHat) ||
                    (gameObject.text == monkeyVals[this.index] && dropZone == dropZoneHat && this.isHat)
                ) {
                    gameObject.setColor("green");
                    this.correct.play();
                    this.options.map((option) => {
                        option.setColor("white");
                    });
                    console.log("this:" + this);
                    
                    console.log("HELLO");
                    this.changeMonkey(gameObject);
                    gameObject.destroy();
                    
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
                else{
                    gameObject.setColor("red");
                    gameObject.x = origin[gameObject.text as keyof typeof origin].x;
                    gameObject.y = origin[gameObject.text as keyof typeof origin].y;
                
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
            "Welcome to Level 2 of Jungle Quest!",
            {
                fontSize: "32px",
                color: "black",
            }
        );
        this.p1 = this.add.text(
            290,
            275,
            "In this level, we'll be working with conditionals. You'll be given a monkey and depending on the condition, you'll need to drag the correct descriptive word to the correct drop zone.",
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
            "The keyword 'this' refers to the object referenced, so for us that is the monkey on the screen",
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

    changeMonkey(old: Phaser.GameObjects.Text) {
        if (this.index < 6) {
            this.monkey.destroy();
            this.isHat = !this.isHat;
            this.index++;
            let temp: Array<Phaser.GameObjects.Text> = [];
            this.options.map((option) => {
                option != old ? temp.push(option) : null;
            });
            this.options = temp;
            //console.log(this.index);
            //console.log(this.monkeys[this.index]);
            this.monkey = this.add.image(350, 325, this.monkeys[this.index]);
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
                "The next level hasn't been implemented yet, so click NEXT to go to the title page.",
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
                this.scene.stop("level2").launch("titleScene");
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
        return ["brown", "hatless"];
    }

    update() {}
}
