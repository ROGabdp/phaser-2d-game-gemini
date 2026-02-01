import Phaser from 'phaser';

export class Preloader extends Phaser.Scene {
    constructor() {
        super('Preloader');
    }

    preload() {
        const assets = this.cache.json.get('assets');

        if (!assets) {
            console.error('Assets JSON not found!');
            return;
        }

        // Load Sprites
        if (assets.sprites) {
            assets.sprites.forEach(sprite => {
                this.load.image(sprite.key, sprite.path);
            });
        }

        // Load Spritesheets
        if (assets.spritesheets) {
            assets.spritesheets.forEach(sheet => {
                this.load.spritesheet(sheet.key, sheet.path, {
                    frameWidth: sheet.frameWidth,
                    frameHeight: sheet.frameHeight
                });
            });
        }

        // Load Tilesets
        if (assets.tilesets) {
            assets.tilesets.forEach(tileset => {
                this.load.image(tileset.key, tileset.path);
            });
        }
    }

    create() {
        const assets = this.cache.json.get('assets');
        this.createAnimations(assets);
        this.scene.start('Game');
    }

    createAnimations(assets) {
        if (!assets.spritesheets) return;

        assets.spritesheets.forEach(sheet => {
            if (sheet.animations) {
                sheet.animations.forEach(anim => {
                    this.anims.create({
                        key: anim.key,
                        frames: this.anims.generateFrameNumbers(sheet.key, { start: anim.start, end: anim.end }),
                        frameRate: anim.frameRate,
                        repeat: anim.repeat
                    });
                });
            }
        });
    }
}
