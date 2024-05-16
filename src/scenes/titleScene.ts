import Phaser from "phaser";
import Collectables from "../objects/collectables";
import UIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin.js";
import buttons from "phaser3-rex-plugins/templates/ui/buttons/Buttons";
import SimpleDropDownList from "phaser3-rex-plugins/templates/ui/simpledropdownlist/SimpleDropDownList";

export default class titleScene extends Phaser.Scene {
    private start: Phaser.GameObjects.Image;
    private start2: Phaser.GameObjects.Image;
    private collect: Phaser.GameObjects.Image;
    private collect2: Phaser.GameObjects.Image;
    private mute: Phaser.GameObjects.Image;
    private unmute: Phaser.GameObjects.Image;
    private music: Phaser.Sound.BaseSound;
    private rexUI: UIPlugin;

    constructor() {
        super({ key: "titleScene" });
    }

    preload() {
        this.load.image("bg", "assets/img/title_screen.png");
        this.load.image("mute", "assets/img/mute.png");
        this.load.image("unmute", "assets/img/unmute.png");
        this.load.image("popup", "assets/img/popup.png");
        this.load.image("rock", "assets/img/rock.png");
        this.load.image("parrot", "assets/img/parrot.png");
        this.load.image("lizard", "assets/img/lizard.png");
        this.load.image("roo", "assets/img/roo.png");
        this.load.image("start", "assets/img/start.png");
        this.load.image("start2", "assets/img/start2.png");
        this.load.image("collect", "assets/img/collect.png");
        this.load.image("collect2", "assets/img/collect2.png");
        this.load.audio("music", "assets/audio/bg.mp3");
        this.load.scenePlugin(
            "rexuiplugin",
            "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js",
            "rexUI",
            "rexUI"
        );
    }

    create() {
        this.add.image(640, 360, "bg");
        this.music = this.sound.add("music", { loop: true });
        this.music.play();

        //collection record
        let collectables: Record<string, boolean> = {
            rock: false,
            parrot: false,
            lizard: false,
            roo: false,
        };

        //start button
        this.start = this.add.image(500, 550, "start").setInteractive();
        this.start2 = this.add
            .image(500, 550, "start2")
            .setVisible(false)
            .setInteractive();
        this.start.on("pointerover", () => {
            this.start.setVisible(false);
            this.start2.setVisible(true);
        });
        this.start2.on("pointerover", () => {
            this.start.setVisible(false);
            this.start2.setVisible(true);
        });
        this.start2.on("pointerout", () => {
            this.start.setVisible(true);
            this.start2.setVisible(false);
        });
        this.start2.on("pointerup", () => {
            this.scene.pause("titleScene").launch("level3", collectables);
        });

        //collectables
        this.collect = this.add.image(800, 550, "collect").setInteractive();
        this.collect2 = this.add
            .image(800, 550, "collect2")
            .setVisible(false)
            .setInteractive();
        this.collect.on("pointerover", () => {
            this.collect.setVisible(false);
            this.collect2.setVisible(true);
        });
        this.collect2.on("pointerover", () => {
            this.collect.setVisible(false);
            this.collect2.setVisible(true);
        });
        this.collect2.on("pointerout", () => {
            this.collect.setVisible(true);
            this.collect2.setVisible(false);
        });
        this.collect2.on("pointerup", () => {
            new Collectables(this).generateMenu(collectables);
        });

        //level select
        this.events.on("resume", () => {

        var dropDownList = this.rexUI.add.simpleDropDownList({
            label: {
                space: { left: 10, right: 10, top: 10, bottom: 10 },
                background: {
                    color: 0x00000,
                },
                text: {
                    fixedWidth: 150,
                },
            },

            button: {
                space: { left: 10, right: 10, top: 10, bottom: 10 },
                background: {
                    color: 0x00000,
                    strokeWidth: 0,
                    "hover.strokeColor": 0xffffff,
                    "hover.strokeWidth": 2,
                },
                text: {
                    fontSize: 20,
                },
            },
        });
        dropDownList
            .setOptions([
                {
                    text: "Level 1",
                    value: "level1",
                },
                {
                    text: "Level 2",
                    value: "level2",
                },
                {
                    text: "Level 3",
                    value: "level3",
                },
            ])
            .resetDisplayContent("Level Select")
            .setPosition(200, 250)
            .layout()
            .on(
                "button.click",
                (
                    dropDownList: SimpleDropDownList,
                    _listPanel: buttons,
                    _button: Phaser.GameObjects.GameObject,
                    index: number,
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    _pointer: Phaser.Input.Pointer,
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    _event: Phaser.Types.Input.EventData
                ) => {
                    this.scene
                        .pause("titleScene")
                        .launch(
                            dropDownList.options[index].value,
                            collectables
                        );
                }
            );
        });

        //mute button
        this.mute = this.add
            .image(50, 50, "mute")
            .setInteractive()
            .setVisible(false);
        this.mute.setAlpha(0.7);
        this.mute.on("pointerover", () => {
            this.mute.setAlpha(1);
        });
        this.mute.on("pointerout", () => {
            this.mute.setAlpha(0.7);
        });
        this.mute.on("pointerup", () => {
            this.mute.setVisible(false);
            this.unmute.setVisible(true);
            this.music.resume();
        });

        this.unmute = this.add.image(50, 50, "unmute").setInteractive();
        this.unmute.setAlpha(0.7);
        this.unmute.on("pointerover", () => {
            this.unmute.setAlpha(1);
        });
        this.unmute.on("pointerout", () => {
            this.unmute.setAlpha(0.7);
        });
        this.unmute.on("pointerup", () => {
            this.unmute.setVisible(false);
            this.mute.setVisible(true);
            this.music.pause();
        });
    }
}
