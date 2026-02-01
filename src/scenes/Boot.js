import Phaser from 'phaser';

export class Boot extends Phaser.Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        this.load.json('assets', 'assets/oakwoods/assets.json');
    }

    create() {
        this.scene.start('Preloader');
    }
}
