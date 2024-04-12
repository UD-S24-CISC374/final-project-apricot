import Phaser from "phaser";

export default class level1 extends Phaser.Scene {
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

    constructor() {
        super({ key: "level1" });
        this.monkeys = [
            "monkey-brown-pirate",
            "monkey-blue-hatless",
            "monkey-yellow-party",
        ];
    }

    preload() {
        this.load.image("background", "assets/img/background.png");
        this.load.image(
            "monkey-brown-pirate",
            "assets/img/monkeys/monkey-brown-pirate.png"
        );
        this.load.image(
            "monkey-blue-hatless",
            "assets/img/monkeys/monkey-blue-hatless.png"
        );
        this.load.image(
            "monkey-yellow-party",
            "assets/img/monkeys/monkey-yellow-party.png"
        );
        this.load.image("help", "assets/img/help-64.png");
        this.load.image("popup", "assets/img/popup.png");
    }

    create() {
        //background + header
        this.add.image(350, 360, "background");
        this.add.rectangle(640, 0, 1280, 150, 0x0000);
        this.add.text(545, 10, "Level 1", {
            fontSize: "48px",
        });

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

        //side boxes
        this.add.rectangle(1000, 250, 600, 350, 0xffff);
        this.add.rectangle(1000, 650, 600, 450, 0x9999);

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

        //default monkey
        this.monkey = this.add.image(350, 325, this.monkeys[0]);

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
            "Fill in the blanks by dragging the correct descriptive word. If you make a mistake, click the reset button.",
            {
                fontSize: "16px",
                color: "black",
                align: "center",
                wordWrap: { width: 700, useAdvancedWrap: true },
            }
        );
        this.destroy = this.add
            .text(575, 450, "CLOSE", {
                fontSize: "16px",
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
        if (index < 3){
            this.monkey.destroy();
            this.monkey = this.add.image(350, 325, this.monkeys[index]);
        }
    }

    update() {}
}
