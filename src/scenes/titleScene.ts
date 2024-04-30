import Phaser from "phaser";
import Collectables from "../objects/collectables";

export default class titleScene extends Phaser.Scene {
    private start: Phaser.GameObjects.Rectangle;
    private collection: Phaser.GameObjects.Rectangle;
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
        this.load.audio("music", "assets/audio/bg.mp3");
    }

    create() {
        this.add.image(640, 360, "bg");
        this.music = this.sound.add("music", {loop: true});
        this.music.play();

        //start button
        this.start = this.add
            .rectangle(500, 550, 200, 100, 0x0000)
            .setInteractive();
        this.start.on("pointerup", () => {
            this.scene.stop("titleScene").launch("level2");
        });
        this.add.text(425, 530, "Start", { color: "white", fontSize: "48px" });

        //collectables
        this.collection = this.add
            .rectangle(850, 550, 400, 100, 0x0000)
            .setInteractive();
        this.collection.on("pointerup", () => {
            new Collectables(this).generateMenu();
        });
        this.add.text(680, 530, "Collectables", {
            color: "white",
            fontSize: "48px",
        });

        //mute button
        this.unmute = this.add.image(50, 50, "unmute").setInteractive().setVisible(false);
        this.unmute.setAlpha(.7);
        this.unmute.on("pointerover", () => {
            this.unmute.setAlpha(1);
        });
        this.unmute.on("pointerout", () => {
            this.unmute.setAlpha(.7);
        });
        this.unmute.on("pointerup", () => {
            this.unmute.setVisible(false);
            this.mute.setVisible(true);
            this.music.resume();
        });

        this.mute = this.add.image(50, 50, "mute").setInteractive();
        this.mute.setAlpha(.7);
        this.mute.on("pointerover", () => {
            this.mute.setAlpha(1);
        });
        this.mute.on("pointerout", () => {
            this.mute.setAlpha(.7);
        });
        this.mute.on("pointerup", () => {
            this.mute.setVisible(false);
            this.unmute.setVisible(true);
            this.music.pause();
        });
    }
}
