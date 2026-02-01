import Phaser from 'phaser';

export class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    init() {
        this.chunkSize = 20; // Number of tiles per chunk
        this.tileSize = 24;  // Pixels per tile
        this.lastChunkX = 0; // X position of the next chunk to be generated (in tiles)
        this.chunkWidthPixel = this.chunkSize * this.tileSize;
    }

    create() {
        const { width, height } = this.scale;

        // Background Layers
        this.bg1 = this.add.tileSprite(0, 0, width, height, 'background_layer_1')
            .setOrigin(0, 0)
            .setScrollFactor(0);

        this.bg2 = this.add.tileSprite(0, 0, width, height, 'background_layer_2')
            .setOrigin(0, 0)
            .setScrollFactor(0);

        this.bg3 = this.add.tileSprite(0, 0, width, height, 'background_layer_3')
            .setOrigin(0, 0)
            .setScrollFactor(0);

        // Ground - Infinite Generation
        const maxTiles = 10000;
        const mapHeight = 10;

        const map = this.make.tilemap({ tileWidth: this.tileSize, tileHeight: this.tileSize, width: maxTiles, height: mapHeight });
        const tileset = map.addTilesetImage('oak_woods_tileset');
        this.groundLayer = map.createBlankLayer('ground', tileset);

        // Initialize Ground (Create tiles first)
        this.generateChunk(); // Chunk 0
        this.generateChunk(); // Chunk 1 (Look ahead)

        // Set collision specifically for the top tile (Index 1)
        this.groundLayer.setCollision(1);

        // --- Character (Player) ---
        this.player = this.physics.add.sprite(50, 100, 'char_blue');
        this.player.setCollideWorldBounds(false);
        this.player.body.setSize(14, 30);
        this.player.body.setOffset(21, 26);
        this.physics.add.collider(this.player, this.groundLayer);
        this.player.play('idle');

        // --- NPC (Mask Boy) ---
        // Place him a bit to the right so he is visible
        this.npc = this.physics.add.sprite(150, 100, 'mask_boy_idle');
        this.npc.setCollideWorldBounds(false);
        this.npc.body.setSize(20, 50); // Approximated box
        this.npc.body.setOffset(22, 14); // Adjusted for 64x64 frame to sit on ground
        this.physics.add.collider(this.npc, this.groundLayer);
        // Initial animation
        this.npc.play('mask_boy_idle_anim');

        // Animation Cycle Logic
        this.time.addEvent({
            delay: 3000,
            loop: true,
            callback: () => {
                const anims = ['mask_boy_idle_anim', 'mask_boy_walk_anim', 'mask_boy_attack_anim'];
                const currentKey = this.npc.anims.currentAnim ? this.npc.anims.currentAnim.key : '';

                let nextAnim = anims[0];
                if (currentKey === anims[0]) nextAnim = anims[1];
                else if (currentKey === anims[1]) nextAnim = anims[2];
                else if (currentKey === anims[2]) nextAnim = anims[0];

                this.npc.play(nextAnim);
            }
        });

        // Camera
        this.cameras.main.setBounds(0, 0, Number.MAX_SAFE_INTEGER, height);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.cameras.main.setDeadzone(50, 0);

        // Controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys('W,A,S,D,Z,X');
    }

    generateChunk() {
        const startX = this.lastChunkX;
        const endX = startX + this.chunkSize;
        const groundY = 6;

        // Simple flat ground generation
        for (let x = startX; x < endX; x++) {
            // Top of ground (Index 1)
            this.groundLayer.putTileAt(1, x, groundY);

            // Below ground (Index 1)
            this.groundLayer.putTileAt(1, x, groundY + 1);
            this.groundLayer.putTileAt(1, x, groundY + 2);
        }

        this.lastChunkX = endX;
    }

    update() {
        if (!this.player) return;

        // Infinite Ground Generation
        const playerTileX = Math.floor(this.player.x / this.tileSize);
        if (playerTileX > this.lastChunkX - (this.chunkSize * 1.5)) {
            this.generateChunk();
        }

        // Parallax
        const camX = this.cameras.main.scrollX;
        this.bg1.tilePositionX = camX * 0.1;
        this.bg2.tilePositionX = camX * 0.3;
        this.bg3.tilePositionX = camX * 0.5;

        // Physics limits (Fall off world)
        if (this.player.y > 300) {
            this.scene.restart();
        }

        const speed = 80;
        const jumpForce = -250;

        const { left, right, up, space } = this.cursors;
        const { A, D, W, Z, X } = this.wasd;

        // Attack Input
        // Only allow attack if on ground
        if (this.player.body.blocked.down && (Phaser.Input.Keyboard.JustDown(Z) || Phaser.Input.Keyboard.JustDown(X))) {
            this.player.play('attack');
            // Stop movement during attack
            this.player.setVelocityX(0);
            return; // Skip other updates
        }

        // If currently attacking, don't move
        if (this.player.anims.isPlaying && this.player.anims.currentAnim.key === 'attack') {
            this.player.setVelocityX(0);
            return;
        }

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
                this.player.play('idle', true);
            }
        }

        // Jump
        if ((up.isDown || W.isDown || space.isDown) && this.player.body.blocked.down) {
            this.player.setVelocityY(jumpForce);
            this.player.play('jump', true);
        }

        // Air Animation Logic
        if (!this.player.body.blocked.down) {
            if (this.player.body.velocity.y < 0) {
                // Rising
                this.player.play('jump', true);
            } else {
                // Falling
                this.player.play('fall', true);
            }
        }

        this.player.on('animationcomplete', (anim) => {
            if (anim.key === 'attack') {
                this.player.play('idle', true);
            }
        });
    }
}
