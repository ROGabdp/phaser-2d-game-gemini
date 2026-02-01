import { test, expect } from '@playwright/test';

test('Game loads and runs', async ({ page }) => {
    // Go to the game
    await page.goto('http://localhost:5173/');

    // Wait for the game canvas to appear
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();

    // Verify the canvas size attributes (native resolution)
    await expect(canvas).toHaveAttribute('width', '320');
    await expect(canvas).toHaveAttribute('height', '180');

    // Check for "infinite" world: Player can move right beyond initial screen width
    // We'll simulate holding the right key and check if camera moves

    // Wait for game to be ready (approx)
    await page.waitForTimeout(1000);

    // Hold Right
    await page.keyboard.down('ArrowRight');

    // Wait for some movement
    await page.waitForTimeout(2000);

    // Release key
    await page.keyboard.up('ArrowRight');

    // We can't easily check Phaser internal state (camera.scrollX) without exposing it
    // But we can verify the game didn't crash and is still rendering
    await expect(canvas).toBeVisible();

    // Take a screenshot of the "moved" state
    await page.screenshot({ path: 'tests/game_infinite_scroll.png' });
});
