import Phaser from 'phaser';

export class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    create() {
        const { width, height } = this.scale;

        // Background Layers
        // We use TileSprite to allow scrolling
        // Native size of backgrounds is 320x180, which matches game size.
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
        // Map size in tiles (24x24 px)
        // 320 / 24 ~= 13.3. Let's make it 40 wide just to be safe.
        // 180 / 24 = 7.5 height.
        const mapWidth = 40;
        const mapHeight = 10;

        const map = this.make.tilemap({ tileWidth: 24, tileHeight: 24, width: mapWidth, height: mapHeight });
        const tileset = map.addTilesetImage('oak_woods_tileset');
        this.groundLayer = map.createBlankLayer('ground', tileset);

        // Fill the bottom rows with tiles to create floor
        // 180px height. Floor at ~156px (row 6.5).
        // Let's put ground at row 6 and 7 (0-indexed). 6*24=144. 7*24=168.
        const groundY = 6;

        for (let x = 0; x < mapWidth; x++) {
            // Top of ground
            this.groundLayer.putTileAt(1, x, groundY);
            // Below ground
            this.groundLayer.putTileAt(1, x, groundY + 1);
            this.groundLayer.putTileAt(1, x, groundY + 2);
        }

        this.groundLayer.setCollisionByExclusion([-1]);

        // Character
        // spawn at left side, above ground
        this.player = this.physics.add.sprite(50, 100, 'char_blue');
        this.player.setCollideWorldBounds(true);

        // Adjust collision body (approximated for 56x56 sprite with padding)
        this.player.body.setSize(14, 30); // Smaller body for tighter hitboxes
        this.player.body.setOffset(21, 26);

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

        // Parallax updates (basic)
        // Since scene is static size, we just auto-scroll slightly for effect
        // or just leave it static. Let's add slight auto-scroll for atmosphere
        // if player moves? No, let's keep it static for now as requested "baseline".
        // Actually, let's add parallax based on camera scroll if we had a wider world.
        // But the world is 320px wide (screen size).
        // So let's keep it static.

        const speed = 60; // Slower speed for smaller resolution
        const jumpForce = -250; // Adjusted for physics scale (gravity 1000 might feel heavy, let's check)

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

        // Attack completion handling
        this.player.on('animationcomplete', (anim) => {
            if (anim.key === 'attack_1' || anim.key === 'attack_2') {
                this.player.play('idle', true);
            }
        });
    }
}
