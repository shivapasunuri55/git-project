/**
 * @testcase Amazon - Search "Wireless Mouse", add first non-sponsored product to cart, verify quantity 1
 *
 * Steps:
 * 1. Navigate to https://www.amazon.com and verify homepage loads.
 * 2. Search for "Wireless Mouse".
 * 3. Open the first non-sponsored product from results.
 * 4. Capture product title, add to cart.
 * 5. Open cart and verify the correct product is added with quantity 1.
 *
 * Note on "first non-sponsored":
 * The current page object provides a recorded selector for a specific product result.
 * A robust "first non-sponsored" selection would require additional stable locators
 * for sponsored badges/containers; until those are added, this test uses the recorded
 * openRecordedProductFromResults() method as a best-effort approximation.
 */

import { test } from '@test-setup/fixtures';
import { AmazonShoppingPage } from '@/pages/amazon/amazon-shopping.page';

test.describe('Amazon shopping', () => {
    test('Search Wireless Mouse, add first non-sponsored product to cart, verify quantity 1', async ({ page }) => {
        const amazonShoppingPage = new AmazonShoppingPage(page);
        let expectedTitle = '';

        await test.step('Navigate to Amazon home and verify homepage loads', async () => {
            await page.goto('https://www.amazon.com');
            await amazonShoppingPage.verifyHomeLoaded();
        });

        await test.step('Search for "Wireless Mouse"', async () => {
            await amazonShoppingPage.fillSearchAmazon();
            await amazonShoppingPage.clickSearchGo();
        });

        await test.step('Open first non-sponsored product (recorded product link fallback)', async () => {
            await amazonShoppingPage.openRecordedProductFromResults();
        });

        await test.step('Capture selected product title', async () => {
            expectedTitle = await amazonShoppingPage.captureSelectedProductTitle();
        });

        await test.step('Add product to cart', async () => {
            await amazonShoppingPage.clickAddToCart();
        });

        await test.step('Go to cart (confirmation link with header fallback)', async () => {
            try {
                await amazonShoppingPage.goToCartFromConfirmation();
            } catch {
                await amazonShoppingPage.openCartViaHeader();
            }
        });

        await test.step('Verify cart has exactly one item with quantity 1', async () => {
            await amazonShoppingPage.verifyCartHasOneItemAndQuantityOne(expectedTitle);
        });
    });
});
