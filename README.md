# Phaser 2D Game - Oak Woods

A 2D platformer game built with [Phaser 3](https://phaser.io/) and [Vite](https://vitejs.dev/), featuring parallax backgrounds, tile-based ground, and a fully animated character.

## Features

- **Parallax Background**: 3-layer scrolling background for depth.
- **Character Controller**: Smooth animations for Idle, Walk, Run, Jump, and Attacks.
- **Controls**:
  - **Move**: WASD or Arrow Keys
  - **Jump**: Space, Up, or W
  - **Attack**: Z (Attack 1), X (Attack 2)
- **Asset Management**: Centralized `assets.json` for easy asset loading.
- **Dimensions**: Native 960x540 resolution (Pixel Art).

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm

### Installation

```bash
npm install
```

### Development

Start the local development server:

```bash
npm run dev
```

Open [http://localhost:5173/](http://localhost:5173/) in your browser.

### Testing

Run the automated Playwright tests to verify the game loads correctly:

```bash
npx playwright test
```

## Directory Structure

- `public/assets/oakwoods`: Game assets (sprites, tilesets).
- `src/scenes`: Phaser Scenes (Boot, Preloader, Game).
- `src/main.js`: Game entry point and configuration.
- `tests/`: Playwright verification tests.
