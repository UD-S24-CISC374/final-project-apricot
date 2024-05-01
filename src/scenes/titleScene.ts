import Phaser from "phaser";
import Collectables from "../objects/collectables";

export default class titleScene extends Phaser.Scene {
    private start: Phaser.GameObjects.Image;
    private start2: Phaser.GameObjects.Image;
    private collect: Phaser.GameObjects.Image;
    private collect2: Phaser.GameObjects.Image;
    private mute: Phaser.GameObjects.Image;
    private unmute: Phaser.GameObjects.Image;
    private music: Phaser.Sound.BaseSound;

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
        this.load.image("start", "assets/img/start.png");
        this.load.image("start2", "assets/img/start2.png");
        this.load.image("collect", "assets/img/collect.png");
        this.load.image("collect2", "assets/img/collect2.png");
        this.load.audio("music", "assets/audio/bg.mp3");
    }

    create() {
        this.add.image(640, 360, "bg");
        this.music = this.sound.add("music", { loop: true });
        this.music.play();

        //collection record
        let collectables: Record<string, boolean> = {
            rock: false,
            parrot: false,
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
            this.scene.pause("titleScene").launch("level1", collectables);
        });

        //collectables
        this.collect = this.add
            .image(800, 550, "collect")
            .setInteractive();
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
