import { test, expect } from '@test-setup/fixtures';
import { StoresPage } from '@/pages/stores.page';

/**
 * Test Case: Stores - Get Direction
 *
 * Steps:
 * 1. Launch the URL
 * 2. Click on 'Store' icon
 * 3. Enter the pincode as '500085'
 * 4. Click on 'Find Stores' button
 * 5. Click on 'Get Direction' button
 * 6. Verify user able to see 'Direction(s)' button
 */
test('Launch URL → Stores → enter pincode → Find Stores → Get Direction → verify Directions visible', async ({ page }) => {
    const storesPage = new StoresPage(page);

    await test.step('1) Launch the URL', async () => {
        // Use configured baseURL (Playwright config) when available; fallback to env var.
        const baseURL = process.env.BASE_URL;
        if (baseURL) {
            await page.goto(baseURL);
        } else {
            await page.goto('/');
        }
    });

    await test.step("2) Click on 'Store(s)' icon", async () => {
        await storesPage.openStores();
    });

    await test.step("3) Enter the pincode as '500085'", async () => {
        await storesPage.enterCityOrPincode('500085');
    });

    await test.step("4) Click on 'Find Stores' button", async () => {
        await storesPage.clickFindStores();
    });

    await test.step("5) Click on 'Get Direction' button", async () => {
        await storesPage.clickFirstGetDirection();
    });

    await test.step("6) Verify user able to see 'Directions'", async () => {
        await storesPage.verifyDirectionsVisible();
        await expect(page.getByText('Directions', { exact: false })).toBeVisible();
    });
});
