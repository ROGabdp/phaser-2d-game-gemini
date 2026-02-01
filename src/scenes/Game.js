import Phaser from 'phaser';

export class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    create() {
        const { width, height } = this.scale;

        // Background Layers
        // We use TileSprite to allow scrolling
        // Scale factor: fitting the image height to the game height if needed
        this.bg1 = this.add.tileSprite(0, 0, width, height, 'background_layer_1')
            .setOrigin(0, 0)
            .setScrollFactor(0);

        this.bg2 = this.add.tileSprite(0, 0, width, height, 'background_layer_2')
            .setOrigin(0, 0)
            .setScrollFactor(0);

        this.bg3 = this.add.tileSprite(0, 0, width, height, 'background_layer_3')
            .setOrigin(0, 0)
            .setScrollFactor(0);

        // Ground
        // Since we don't have a map file, we create a blank map
        const map = this.make.tilemap({ tileWidth: 24, tileHeight: 24, width: 40, height: 23 }); // 960/24 = 40, 540/24 = 22.5
        const tileset = map.addTilesetImage('oak_woods_tileset');
        this.groundLayer = map.createBlankLayer('ground', tileset);

        // Fill the bottom 2 rows with tiles
        // We don't know the exact tile IDs, let's assume some basics or randomize for texture
        // Tile indices are 0-based. Let's try 0, 1, 2 for now.
        // If the tileset is standard, the top-left is 0.
        // We will fill the bottom with index 1 (safe guess) and top of ground with index 0.

        const groundY = 21; // 2nd to last row
        for (let x = 0; x < 40; x++) {
            this.groundLayer.putTileAt(1, x, groundY);
            this.groundLayer.putTileAt(1, x, groundY + 1);
        }

        this.groundLayer.setCollisionByExclusion([-1]);

        // Scale background to fit height if needed (simple fix)
        // Assuming 960x540, and bg images might be e.g. 320x180
        // We can scale them up.
        const scaleX = width / this.bg1.width;
        const scaleY = height / this.bg1.height;
        const scale = Math.max(scaleX, scaleY);

        this.bg1.setScale(scale).setScrollFactor(0);
        this.bg2.setScale(scale).setScrollFactor(0);
        this.bg3.setScale(scale).setScrollFactor(0);

        // Character
        // spawn at left side, above ground
        this.player = this.physics.add.sprite(100, 400, 'char_blue');
        this.player.setCollideWorldBounds(true);

        // Adjust collision body (approximated for 56x56 sprite with padding)
        this.player.body.setSize(20, 40);
        this.player.body.setOffset(18, 16); // Centering the body

        this.physics.add.collider(this.player, this.groundLayer);

        // Camera bounds
        this.cameras.main.setBounds(0, 0, width, height);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

        // Controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys('W,A,S,D,Z,X');

        // Initial state
        this.player.play('idle');
    }

    update() {
        if (!this.player) return;

        // Parallax updates based on camera scroll (if camera moves)
        // Since we have a static screen size for now (until we make the world larger),
        // we can scroll just based on player position or keep it static.
        // For the baseline, let's keep it static or use the previous auto-scroll for demo.
        // Actually, let's stop auto-scroll and make it reactive to player if we had a wide world.
        // But our "map" is only 40 tiles wide (960px), which matches the screen.
        // So no scrolling needed yet.

        const speed = 160;
        const jumpForce = -400; // Gravity is 1000

        const { left, right, up, space } = this.cursors;
        const { A, D, W, Z, X } = this.wasd;

        // Movement
        if (left.isDown || A.isDown) {
            this.player.setVelocityX(-speed);
            this.player.setFlipX(true);
            if (this.player.body.blocked.down) this.player.anims.play('run', true);
        }
        else if (right.isDown || D.isDown) {
            this.player.setVelocityX(speed);
            this.player.setFlipX(false);
            if (this.player.body.blocked.down) this.player.anims.play('run', true);
        }
        else {
            this.player.setVelocityX(0);
            if (this.player.body.blocked.down) {
                // If attacking
                if (Phaser.Input.Keyboard.JustDown(Z)) {
                    this.player.play('attack_1');
                } else if (Phaser.Input.Keyboard.JustDown(X)) {
                    this.player.play('attack_2');
                } else {
                    // Only play idle if not attacking
                    if (!this.player.anims.isPlaying || (this.player.anims.currentAnim.key !== 'attack_1' && this.player.anims.currentAnim.key !== 'attack_2')) {
                        this.player.play('idle', true);
                    }
                }
            }
        }

        // Jump
        if ((up.isDown || W.isDown || space.isDown) && this.player.body.blocked.down) {
            this.player.setVelocityY(jumpForce);
            this.player.play('jump', true);
        }

        // Attack completion handling (simple)
        this.player.on('animationcomplete', (anim) => {
            if (anim.key === 'attack_1' || anim.key === 'attack_2') {
                this.player.play('idle', true);
            }
        });
    }
}
