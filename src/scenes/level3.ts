import Phaser from "phaser";
import Clock from "phaser3-rex-plugins/plugins/clock";

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
    private incorrect: Phaser.Sound.BaseSound;
    private banana: Phaser.Sound.BaseSound;
    private coconut: Phaser.Sound.BaseSound;
    private coconut1: Phaser.GameObjects.Image;
    private coconut2: Phaser.GameObjects.Image;
    private coconut3: Phaser.GameObjects.Image;
    private banana1: Phaser.GameObjects.Image;
    private banana2: Phaser.GameObjects.Image;
    private banana3: Phaser.GameObjects.Image;
    private star1: Phaser.GameObjects.Image;
    private star2: Phaser.GameObjects.Image;
    private star3: Phaser.GameObjects.Image;
    private reset: Phaser.GameObjects.Image;
    /**Used for the index of the animal to change */
    private index: number;
    private count: number;

    private isHat: boolean;
    private options: Array<Phaser.GameObjects.Text>;
    private ifStatement: Phaser.GameObjects.Text;
    private ifAction: Phaser.GameObjects.Text;
    private elseStatement: Phaser.GameObjects.Text;
    private elseAction: Phaser.GameObjects.Text;
    private clock: Clock;
    private complete: boolean;
    /**
     * The values of the animals in the order they appear in the animals array.
     */
    private animalTypes: Array<{
        type: string;
        color: string;
        attr1Name: string;
        attr1: string;
        attr2Name: string;
        attr2: string;
    }>;
    private conditions: Array<{ if: string; else: string }>;
    private actions: Array<{ if: string; else: string }>;
    private headerText: Phaser.GameObjects.Text;
    private superCall: Phaser.GameObjects.Text;
    private attr1Text: Phaser.GameObjects.Text;
    private attr2Text: Phaser.GameObjects.Text;

    constructor() {
        super({ key: "level3" });
        this.defaultValues();
    }
    defaultValues() {
        this.animals = ["brown-pirate hat", "parrot2", "sloth"];
        this.index = 0;
        this.count = 0;
        this.isHat = false;
        this.options = [];
        this.animalTypes = [
            {
                type: "Class Monkey extends Animal{",
                color: `super("brown");`,
                attr1Name: "this.hat",
                attr1: `"pirate hat";`,
                attr2Name: "this.canSwing",
                attr2: "true;",
            },
            {
                type: "Class Parrot extends Animal{",
                color: `super("MultiColor");`,
                attr1Name: "this.canSpeak",
                attr1: "true;",
                attr2Name: "this.canFly",
                attr2: "true;",
            },
            {
                type: "Class Sloth extends Animal{",
                color: `super("tan");`,
                attr1Name: "clawCount",
                attr1: "6;",
                attr2Name: "this.isLazy",
                attr2: "true;",
            },
        ];
        //Add more conditions for more questions?
        this.conditions = [
            {
                if: "if(this.color == 'brown' or canSwing == False){", //Set Brown
                else: "else if(this.hat == 'pirate hat){",
            },
            {
                if: "if(this.canSpeak and this.canFly){",
                else: "else if(this.color == 'red'){",
            },
            {
                if: "if(!this.isLazy){",
                else: "else if(this.clawCount >= 6){",
            },
        ];
        this.actions = [
            {
                if: "action('Feed three bananas to the monkey.')",
                else: "action('Click on the jaguar three times.')",
            },
            {
                if: "action('Click on three coconuts.')",
                else: "action('Click on the jaguar three times.')",
            },
            {
                if: "action('Click on the jaguar three times.')",
                else: "action('Move the sloth into the trees.')",
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
        this.load.image("parrot2", "assets/img/parrot2.png");
        this.load.image("sloth", "assets/img/sloth.png");
        this.load.image("help", "assets/img/help-64.png");
        this.load.image("popup", "assets/img/popup.png");
        this.load.image("coconut", "assets/img/coconut.png");
        this.load.image("banana", "assets/img/banana.png");
        this.load.image("gold-star", "assets/img/gold-star.png");
        this.load.image("empty-star", "assets/img/empty-star.png");
        this.load.audio("correct", "assets/audio/correct-choice.mp3");
        this.load.audio("incorrect", "assets/audio/incorrect-choice.mp3");
        this.load.image("reset", "assets/img/reset.png");
        this.load.audio("coconut", "assets/audio/coconut.mp3")
        this.load.audio("banana", "assets/audio/banana.mp3");
    }

    create() {
        this.defaultValues();
        //background + header
        this.add.image(350, 360, "background");
        this.add.rectangle(640, 0, 1280, 150, 0x0000);

        this.add.text(545, 10, "Level 3", {
            fontSize: "48px",
        });

        this.correct = this.sound.add("correct");
        this.incorrect = this.sound.add("incorrect");
        this.coconut = this.sound.add("coconut");
        this.banana = this.sound.add("banana");

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
            this.scene.stop("level3").resume("titleScene");
        });

        //reset button
        this.reset = this.add.image(230, 33, "reset").setInteractive();
        this.reset.scale = 0.3;
        this.reset.setAlpha(0.7);
        this.reset.on("pointerover", () => {
            this.reset.setAlpha(1);
        });
        this.reset.on("pointerout", () => {
            this.reset.setAlpha(0.7);
        });
        this.reset.on("pointerup", () => {
            this.clock.stop();
            this.scene.restart();
        });

        //side boxes
        this.add.rectangle(1000, 400, 600, 650, 0xffff);
        this.add.rectangle(1000, 400, 600, 100, 0x9999);

        this.add.image(350, 325, "brown-pirate");
        /**
         * The origin locations of the text options to be dragged.
         
        const origin: Record<string, { x: number; y: number }> = {
            brown: { x: 720, y: 500 },
            blue: { x: 1000, y: 500 },
            "pirate hat": { x: 720, y: 550 },
            yellow: { x: 1000, y: 550 },
            hatless: { x: 720, y: 600 },
            "party hat": { x: 1000, y: 600 },
        };
        */
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
        this.headerText = this.add.text(720, 470, this.animalTypes[0].type, {
            fontSize: "20px",
            color: "black",
        });
        this.superCall = this.add.text(770, 500, this.animalTypes[0].color, {
            fontSize: "20px",
            color: "black",
        });
        this.attr1Text = this.add.text(
            770,
            530,
            this.animalTypes[0].attr1Name + " = " + this.animalTypes[0].attr1,
            {
                fontSize: "20px",
                color: "black",
            }
        );
        this.attr2Text = this.add.text(
            770,
            560,
            this.animalTypes[0].attr2Name + " = " + this.animalTypes[0].attr2,
            {
                fontSize: "20px",
                color: "black",
            }
        );
        this.add.text(720, 590, "}", {
            fontSize: "20px",
            color: "black",
        });

        //default animal
        this.animal = this.add.image(350, 325, this.animals[0]);

        let clicks = 0;
        this.add
            .rectangle(175, 600, 300, 150, 0xfffff)
            .setAlpha(0.000001)
            .setInteractive()
            .on("pointerup", () => {
                clicks += 1;
                if (clicks == 3) {
                    this.incorrect.play();
                    this.scene.restart();
                }
            });

        //sloth box

        //bananas
        this.add
            .zone(125, 250, 200, 300)
            .setRectangleDropZone(200, 300)
            .setInteractive();
        //coconuts
        this.coconut1 = this.add
            .image(150, 200, "coconut")
            .setScale(0.5)
            .setVisible(false)
            .setInteractive()
            .on("pointerup", () => {
                this.coconut.play();
                this.coconut1.destroy();
                this.count += 1;
                if (this.count == 3) {
                    this.changeAnimal();
                }
            });
        this.coconut2 = this.add
            .image(450, 675, "coconut")
            .setScale(0.5)
            .setVisible(false)
            .setInteractive()
            .on("pointerup", () => {
                this.coconut.play();
                this.coconut2.destroy();
                this.count += 1;
                if (this.count == 3) {
                    this.changeAnimal();
                }
            });
        this.coconut3 = this.add
            .image(650, 300, "coconut")
            .setScale(0.5)
            .setVisible(false)
            .setInteractive()
            .on("pointerup", () => {
                this.coconut.play();
                this.coconut3.destroy();
                this.count += 1;
                if (this.count == 3) {
                    this.correct.play();
                    this.changeAnimal();
                }
            });
        this.banana1 = this.add
            .image(150, 200, "banana")
            .setScale(0.5)
            .setInteractive();
        this.banana2 = this.add
            .image(450, 675, "banana")
            .setScale(0.5)
            .setInteractive();
        this.banana3 = this.add
            .image(650, 300, "banana")
            .setScale(0.5)
            .setInteractive();

        this.input.setDraggable(this.banana1);
        this.input.setDraggable(this.banana2);
        this.input.setDraggable(this.banana3);
        //drop zones
        const dropZoneMonkey: Phaser.GameObjects.Zone = this.add
            .zone(350, 325, 100, 100)
            .setRectangleDropZone(100, 200)
            .setInteractive();



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
            "drop",
            (
                pointer: Phaser.Input.Pointer,
                gameObject: { x: number; y: number },
                dropZone: Phaser.GameObjects.Zone
            ) => {
                gameObject.x = dropZone.x;
                gameObject.y = dropZone.y;
                if (gameObject == this.banana1 && dropZone == dropZoneMonkey) {
                    this.banana.play();
                    this.banana1.destroy();
                    this.count += 1;
                    console.log(this.count);
                } 
                else if (gameObject == this.banana2 && dropZone == dropZoneMonkey) {
                    this.banana.play();
                    this.banana2.destroy();
                    this.count += 1;
                    console.log(this.count);
                }
                else if (gameObject == this.banana3 && dropZone == dropZoneMonkey){
                    this.banana.play();
                    this.banana3.destroy();
                    this.count += 1;
                    console.log(this.count);
                }
                if (this.count == 3) {
                    this.correct.play();
                    this.changeAnimal();
                }
            }
        );

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
    changeAnimal() {
        if (this.index < this.animals.length - 1) {
            this.animal.destroy();
            this.index++;
            this.changeText();
            this.animal = this.add.image(350, 325, this.animals[this.index]);
            //coconuts
            if (this.animal.texture.key == "parrot2") {
                this.count = 0;
                this.coconut1.setVisible(true);
                this.coconut2.setVisible(true);
                this.coconut3.setVisible(true);
            }
            else if(this.animal.texture.key == "sloth"){
                this.animal.setInteractive();
                this.input.setDraggable(this.animal);
            }
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
            if (this.clock.now < 20000) {
                this.star1 = this.add
                    .image(400, 350, "gold-star")
                    .setScale(0.5);
                this.star2 = this.add
                    .image(600, 350, "gold-star")
                    .setScale(0.5);
                this.star3 = this.add
                    .image(800, 350, "gold-star")
                    .setScale(0.5);
            } else if (this.clock.now < 25000) {
                this.star1 = this.add
                    .image(400, 350, "gold-star")
                    .setScale(0.5);
                this.star2 = this.add
                    .image(600, 350, "gold-star")
                    .setScale(0.5);
                this.star3 = this.add
                    .image(800, 350, "empty-star")
                    .setScale(0.5);
            } else if (this.clock.now < 30000) {
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
                "Fantastic work! You've complete all the levels. Thanks for playing! Click HOME to return to the main menu.",
                {
                    fontSize: "16px",
                    color: "black",
                    align: "center",
                    wordWrap: { width: 700, useAdvancedWrap: true },
                }
            );
            this.destroy = this.add
                .text(575, 550, "HOME", {
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
                this.scene.stop("level3").resume("titleScene");
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
     * This function changes the text of the of the activity to different ones.
     */
    changeText(): void {
        if (this.index < this.conditions.length) {
            this.ifAction.setText(this.actions[this.index].if);
            this.elseAction.setText(this.actions[this.index].else);
            this.ifStatement.setText(this.conditions[this.index].if);
            this.elseStatement.setText(this.conditions[this.index].else);
            this.headerText.setText(this.animalTypes[this.index].type);
            this.attr1Text.setText(
                this.animalTypes[this.index].attr1Name +
                    " = " +
                    this.animalTypes[this.index].attr1
            );
            this.attr2Text.setText(
                this.animalTypes[this.index].attr2Name +
                    " = " +
                    this.animalTypes[this.index].attr2
            );
        }
    }

    update() {}
}
