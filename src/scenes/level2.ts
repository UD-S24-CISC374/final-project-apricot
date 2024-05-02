import Phaser from "phaser";
import Clock from "phaser3-rex-plugins/plugins/clock";

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
    private index: number;
    private isHat: boolean;
    private options: Array<Phaser.GameObjects.Text>;
    private ifStatement: Phaser.GameObjects.Text;
    private elseStatement: Phaser.GameObjects.Text;
    private monkeyVals: Array<string>;
    private conditions: Array<{ if: string; else: string }>;
    private star1: Phaser.GameObjects.Image;
    private star2: Phaser.GameObjects.Image;
    private star3: Phaser.GameObjects.Image;
    private clock: Clock;

    constructor() {
        super({ key: "level2" });
        this.monkeys = ["brown-pirate hat", "blue-hatless", "yellow-party hat"];
        this.index = 0;
        this.isHat = false;
        this.options = [];
        this.monkeyVals = [
            "brown",
            "hatless",
            "yellow",
            "pirate hat",
            "blue",
            "party hat",
        ];
        //Add more conditions for more questions?
        this.conditions = [
            {
                if: "if(monkey.hat == 'pirate hat'){", //Set Brown
                else: "else if(monkey.color == 'blue'){",
            },
            {
                if: "if(monkey.hat == 'pirate hat'){",
                else: "else if(monkey.color == 'blue'){", // Set Hatless
            },
            {
                if: "if(monkey.hat == 'party hat'){", // Set yellow
                else: "else if(monkey.color == 'brown'){",
            },
            {
                if: "if(monkey.hat == 'party hat'){",
                else: "else{", // Set Pirate Hat
            },
            {
                if: "if(monkey.hat == 'hatless'){", //Set blue
                else: "else{",
            },
            {
                if: "if(monkey.hat == 'Pirate hat'){",
                else: "else{", // Set Party Hat
            },
        ];
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
        this.load.image("gold-star", "assets/img/gold-star.png");
        this.load.image("empty-star", "assets/img/empty-star.png");
    }

    create(collectables: Record<string, boolean>) {
        //background + header
        this.add.image(350, 360, "background");
        this.add.rectangle(640, 0, 1280, 150, 0x0000);

        this.add.text(545, 10, "Level 2", {
            fontSize: "48px",
        });

        this.correct = this.sound.add("correct", { loop: false });

        this.clock = new Clock(this, {});
        this.clock.start();

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
            this.clock.stop();
            this.scene.stop("level2").resume("titleScene");
        });

        //side boxes
        this.add.rectangle(1000, 250, 600, 350, 0xffff);
        this.add.rectangle(1000, 650, 600, 450, 0x9999);

        this.add.image(350, 325, "brown-pirate");
        const origin: Record<string, { x: number; y: number }> = {
            brown: { x: 720, y: 500 },
            blue: { x: 1000, y: 500 },
            "pirate hat": { x: 720, y: 550 },
            yellow: { x: 1000, y: 550 },
            hatless: { x: 720, y: 600 },
            "party hat": { x: 1000, y: 600 },
        };
        let brown = this.add
            .text(720, 500, "brown", { fontSize: "42px" })
            .setInteractive();
        let pirateHat = this.add
            .text(720, 550, "pirate hat", { fontSize: "42px" })
            .setInteractive();
        let blue = this.add
            .text(1000, 500, "blue", { fontSize: "42px" })
            .setInteractive();
        let yellow = this.add
            .text(1000, 550, "yellow", { fontSize: "42px" })
            .setInteractive();
        let hatless = this.add
            .text(720, 600, "hatless", { fontSize: "42px" })
            .setInteractive();
        let partyHat = this.add
            .text(1000, 600, "party hat", { fontSize: "42px" })
            .setInteractive();
        this.options = [brown, blue, pirateHat, yellow, hatless, partyHat];
        this.input.setDraggable(brown, true);
        this.input.setDraggable(blue, true);
        this.input.setDraggable(pirateHat, true);
        this.input.setDraggable(yellow, true);
        this.input.setDraggable(hatless, true);
        this.input.setDraggable(partyHat, true);

        //default monkey
        this.monkey = this.add.image(350, 325, this.monkeys[0]);

        this.ifStatement = this.add.text(720, 100, this.conditions[0].if, {
            fontSize: "24px",
            color: "black",
        });
        this.add.text(770, 150, "this.color = ", {
            fontSize: "22px",
            color: "black",
        });
        this.add.text(725, 190, "}", {
            fontSize: "24px",
            color: "black",
        });
        this.elseStatement = this.add.text(720, 230, this.conditions[0].else, {
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

                if (
                    (gameObject.text == this.monkeyVals[this.index] &&
                        dropZone == dropZoneColor &&
                        !this.isHat) ||
                    (gameObject.text == this.monkeyVals[this.index] &&
                        dropZone == dropZoneHat &&
                        this.isHat)
                ) {
                    gameObject.setColor("green");
                    this.correct.play();
                    this.options.map((option) => {
                        option.setColor("white");
                    });
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
                } else {
                    gameObject.setColor("red");
                    console.log(gameObject.text);
                    console.log(this.monkeyVals[this.index]);
                    console.log(dropZone);
                    console.log(this.isHat);
                    gameObject.x =
                        origin[gameObject.text as keyof typeof origin].x;
                    gameObject.y =
                        origin[gameObject.text as keyof typeof origin].y;
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

        //collectables
        if (collectables.length) {
            console.log("");
        }

        this.generatePopUp();
    }
    /**
     * This function generates a pop up that explains the level to the user.
     */
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
    /**
     * @param old The old monkey that was on the screen, will be destroyed.
     * This function changes the monkey on the screen to the next monkey in the list.
     */
    changeMonkey(old: Phaser.GameObjects.Text) {
        if (this.index < this.conditions.length - 1) {
            this.monkey.destroy();
            this.isHat = !this.isHat;
            let temp: Array<Phaser.GameObjects.Text> = [];
            this.options.map((option) => {
                option != old ? temp.push(option) : null;
            });
            this.options = temp;
            this.index++;
            this.changeCondition();
            this.monkey = this.add.image(
                350,
                325,
                this.monkeys[this.index % 3]
            );
        } else {
            this.popup = this.add
                .image(225, 125, "popup")
                .setOrigin(0)
                .setScale(1.25);
            this.title = this.add.text(
                300,
                200,
                "Congrats! You did it! Great job!",
                {
                    fontSize: "32px",
                    color: "black",
                    align: "center",
                }
            );

            if (this.clock.now < 25000) {
                this.star1 = this.add
                    .image(400, 350, "gold-star")
                    .setScale(0.5);
                this.star2 = this.add
                    .image(600, 350, "gold-star")
                    .setScale(0.5);
                this.star3 = this.add
                    .image(800, 350, "gold-star")
                    .setScale(0.5);
            } else if (this.clock.now < 30000) {
                this.star1 = this.add
                    .image(400, 350, "gold-star")
                    .setScale(0.5);
                this.star2 = this.add
                    .image(600, 350, "gold-star")
                    .setScale(0.5);
                this.star3 = this.add
                    .image(800, 350, "empty-star")
                    .setScale(0.5);
            } else if (this.clock.now < 35000) {
                this.star1 = this.add
                    .image(400, 350, "gold-star")
                    .setScale(0.5);
                this.star2 = this.add
                    .image(600, 350, "empty-star")
                    .setScale(0.5);
                this.star3 = this.add
                    .image(800, 350, "empty-star")
                    .setScale(0.5);
            } else {
                this.star1 = this.add
                    .image(400, 350, "empty-star")
                    .setScale(0.5);
                this.star2 = this.add
                    .image(600, 350, "empty-star")
                    .setScale(0.5);
                this.star3 = this.add
                    .image(800, 350, "empty-star")
                    .setScale(0.5);
            }

            this.p1 = this.add.text(
                290,
                475,
                "The next level hasn't been implemented yet, so click NEXT to go to the title page.",
                {
                    fontSize: "16px",
                    color: "black",
                    align: "center",
                    wordWrap: { width: 700, useAdvancedWrap: true },
                }
            );
            this.destroy = this.add
                .text(575, 550, "NEXT", {
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
                this.clock.stop();
                this.container.destroy();
                this.scene.stop("level2").resume("titleScene");
            });

            this.container = this.add.container(0, 0, [
                this.popup,
                this.title,
                this.p1,
                this.star1,
                this.star2,
                this.star3,
                this.destroy,
            ]);
        }
    }
    /**
     * This function changes the text of the conditions to different ones.
     */
    changeCondition(): void {
        if (this.index < this.conditions.length) {
            console.log("this is the current conditon to be set");
            console.log(this.conditions[this.index]);
            this.ifStatement.setText(this.conditions[this.index].if);
            this.elseStatement.setText(this.conditions[this.index].else);
        }
    }

    update() {}
}
