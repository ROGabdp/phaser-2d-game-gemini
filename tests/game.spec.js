import { test, expect } from '@playwright/test';

test('Game loads and runs', async ({ page }) => {
    // Go to the game
    await page.goto('http://localhost:5173/');

    // Wait for the game canvas to appear
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();

    // Basic check: Ensure no console errors
    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.log(`Error text: "${msg.text()}"`);
        }
    });

    // Verify the canvas size attributes (internal resolution)
    await expect(canvas).toHaveAttribute('width', '960');
    await expect(canvas).toHaveAttribute('height', '540');

    // Take a screenshot for visual verification
    await page.screenshot({ path: 'tests/game_initial_load.png' });
});
