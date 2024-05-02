import Phaser from "phaser";

export default class level3 extends Phaser.Scene {
    private animals: Array<string>;
    private animal: Phaser.GameObjects.Image;
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
    /**Used for the index of the animal to change */
    private index : number;

    private isHat: boolean;
    private options: Array<Phaser.GameObjects.Text>;
    private ifStatement: Phaser.GameObjects.Text;
    private ifAction: Phaser.GameObjects.Text;
    private elseStatement: Phaser.GameObjects.Text;
    private elseAction: Phaser.GameObjects.Text;
    /**
     * The values of the animals in the order they appear in the animals array.
     */
    private animalTypes: Array<{type: string, color: string,
                                attr1Name: string, attr1: string,
                                attr2Name: string, attr2: string}>;
    private conditions: Array<{if:string,else:string}>;
    private actions: Array<{if:string,else:string}>;

    constructor() {
        super({ key: "level3" });
        this.animals = ["brown-pirate hat", "blue-hatless", "yellow-party hat"];
        this.index = 0;
        this.isHat = false;
        this.options = [];
        this.animalTypes = [
            {
                type: "Monkey",
                color: "brown",
                attr1Name: "hat",
                attr1: "pirate hat",
                attr2Name: "canSwing",
                attr2: "true"
            },
            {
                type: "Parrot",
                color: "MultiColor",
                attr1Name: "multiColor",
                attr1: "true",
                attr2Name: "canFly",
                attr2: "true"
            }
        ];
        //Add more conditions for more questions?
        this.conditions = [
            {
                if:"If statement location", //Set Brown
                else: "Else statement location"
            }
        ]
        this.actions = [
            {
                if: "If statement action",
                else: "else statement action"
            }
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
    }

    create() {
        //background + header
        this.add.image(350, 360, "background");
        this.add.rectangle(640, 0, 1280, 150, 0x0000);

        this.add.text(545, 10, "Level 3", {
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
        this.add.rectangle(1000, 400, 600, 650, 0xffff);
        this.add.rectangle(1000, 400, 600, 100, 0x9999);

        this.add.image(350, 325, "brown-pirate");
        /**
         * The origin locations of the text options to be dragged.
         */
        const origin: Record<string, { x: number; y: number }> = {
            "brown": { x: 720, y: 500 },
            "blue": { x: 1000, y: 500 },
            "pirate hat": { x: 720, y: 550 },
            "yellow": { x: 1000, y: 550 },
            "hatless": { x: 720, y: 600 },
            "party hat": { x: 1000, y: 600 }
        };
        //These are the main if statement locations, altered based on current status of level
        this.ifStatement = this.add.text(720, 100, this.conditions[0].if, {
            fontSize: "20px",
            color: "black",
        });
        this.ifAction = this.add.text(770, 150, this.actions[0].if, {
            fontSize: "20px",
            color: "black",
        });
        this.add.text(725, 180, "}", {
            fontSize: "20px",
            color: "black",
        });
        this.elseStatement = this.add.text(720, 220, this.conditions[0].else, {
            fontSize: "20px",
            color: "black",
        });
        this.elseAction = this.add.text(770, 260, this.actions[0].else, {
            fontSize: "20px",
            color: "black",
        });
        this.add.text(725, 300, "}", {
            fontSize: "20px",
            color: "black",
        });

        //This is the animal class that is used for the Super class of the animals
        this.add.text(850, 360, "class Animal(color){", {
            fontSize: "18px",
            color: "black",
        });
        this.add.text(900, 390, "this.color = color;", {
            fontSize: "18px",
            color: "black",
        });
        this.add.text(850, 420, "}", {
            fontSize: "18px",
            color: "black",
        });

        //These are the classes for the different types of animals
        this.add.text(720, 470, `Class ${this.animalTypes[0].type} extends Animal{`, {
            fontSize: "20px",
            color: "black",
        });
        this.add.text(770, 500, `super("${this.animalTypes[0].color}");`, {
            fontSize: "20px",
            color: "black",
        });
        this.add.text(770, 530, `this.${this.animalTypes[0].attr1Name} = "${this.animalTypes[0].attr1}";`, {
            fontSize: "20px",
            color: "black",
        });
        this.add.text(770, 560, `this.${this.animalTypes[0].attr2Name} = ${this.animalTypes[0].attr2};`, {
            fontSize: "20px",
            color: "black",
        });
        this.add.text(720, 590, "}", {
            fontSize: "20px",
            color: "black",
        });


        //default animal
        this.animal = this.add.image(350, 325, this.animals[0]);

        //drop zones
        /* const dropZoneColor: Phaser.GameObjects.Zone = this.add
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
                    (gameObject.text == this.animalVals[this.index] && dropZone == dropZoneColor && !this.isHat) ||
                    (gameObject.text == this.animalVals[this.index] && dropZone == dropZoneHat && this.isHat)
                ) {
                    gameObject.setColor("green");
                    this.correct.play();
                    this.options.map((option) => {
                        option.setColor("white");
                    });
                    this.changeanimal(gameObject);
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
                    console.log(gameObject.text);
                    console.log(this.animalVals[this.index]);
                    console.log(dropZone);
                    console.log(this.isHat);
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
        ); */

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
            "Welcome to Level 3 of Jungle Quest!",
            {
                fontSize: "32px",
                color: "black",
            }
        );
        this.p1 = this.add.text(
            290,
            275,
            `In this level, you will have to use the skills you learned in level 1 and 2 to solve the challenges.
            
            You will get an animal and a condition, you will have to complete the correct action to pass the level`,
            {
                fontSize: "16px",
                color: "black",
                align: "center",
                wordWrap: { width: 700, useAdvancedWrap: true },
            }
        );
        this.p2 = this.add.text(
            290,
            375,
            `This time, we're introducing class inheritance. We do that by making a new super class with fields that other classes have in common.
            The other classes will 'extend' the super class and add their own unique fields, but they keep the fields from the super class.`,
            {
                fontSize: "16px",
                color: "black",
                align: "center",
                wordWrap: { width: 700, useAdvancedWrap: true },
            }
        );
        this.destroy = this.add
            .text(575, 500, "CLOSE", {
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
     * @param old The old animal that was on the screen, will be destroyed.
     * This function changes the animal on the screen to the next animal in the list.
     */
    changeanimal(old: Phaser.GameObjects.Text) {
        if (this.index < this.conditions.length-1) {
            this.animal.destroy();
            this.isHat = !this.isHat;
            let temp: Array<Phaser.GameObjects.Text> = [];
            this.options.map((option) => {
                option != old ? temp.push(option) : null;
            });
            this.options = temp;
            this.index++;
            this.changeCondition();
            this.animal = this.add.image(350, 325, this.animals[this.index % 3]);
                        
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
    /**
     * This function changes the text of the conditions to different ones.
     */
    changeCondition(): void {
        if(this.index < this.conditions.length){
            console.log("this is the current conditon to be set");
            console.log(this.conditions[this.index]);
            this.ifStatement.setText(this.conditions[this.index].if);
            this.elseStatement.setText(this.conditions[this.index].else);
        }
    }

    update() {}
}
