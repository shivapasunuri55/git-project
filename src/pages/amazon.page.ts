import { expect, Page, BrowserContext, Browser, Locator } from '@playwright/test';
import { BasePage } from '@/pages/base.page';
import { ActionUtils } from '@/utils/action-utils';

/**
 * AmazonPage encapsulates the recorded Amazon shopping flow.
 *
 * Covered flow:
 * - Navigate to Amazon home
 * - Search for a product
 * - Open a recorded product from results
 * - Add to cart
 * - Go to cart and verify cart contents
 */
export class AmazonPage extends BasePage {
    /**
     * Creates an instance of AmazonPage.
     *
     * @param page Playwright Page instance.
     * @param context Optional Playwright BrowserContext.
     * @param browser Optional Playwright Browser.
     */
    constructor(page: Page, context?: BrowserContext, browser?: Browser) {
        super(page, context, browser);
    }

    /**
     * Navigate to Amazon home page.
     *
     * Note: Navigation is owned by BasePage.navigateTo; this method must not call page.goto directly.
     *
     * @param url Target URL (e.g., https://www.amazon.com).
     */
    async navigateToHome(url: string): Promise<void> {
        await this.navigateTo(url);
    }

    /**
     * Verify Amazon home page is loaded by asserting the search box is visible.
     */
    async verifyHomeLoaded(): Promise<void> {
        const searchBox = this.page.getByRole('searchbox', { name: 'Search Amazon' });
        await expect(searchBox).toBeVisible();
    }

    /**
     * Fill the Amazon search box with the provided term.
     *
     * Recorded step mapping (Step 1):
     * await page.getByRole('searchbox', { name: 'Search Amazon' }).fill('Wireless Mouse');
     *
     * @param term Search term to enter.
     */
    async fillSearch(term: string): Promise<void> {
        const searchBox = this.page.getByRole('searchbox', { name: 'Search Amazon' });
        await ActionUtils.fill(searchBox, term, { page: this.page });
    }

    /**
     * Submit the search.
     *
     * Recorded step mapping (Step 2):
     * await page.getByRole('button', { name: 'Go', exact: true }).click();
     */
    async submitSearch(): Promise<void> {
        const goButton = this.page.getByRole('button', { name: 'Go', exact: true });
        await ActionUtils.clickAndNavigate(goButton, { page: this.page });
    }

    /**
     * Open the recorded product from the search results.
     *
     * Recorded step mapping (Step 3):
     * await page.getByRole('link', { name: 'Logitech M185 Wireless Mouse, 2.4GHz with USB Mini Receiver, 12-Month Battery Life, 1000 DPI Optical Tracking, Ambidextrous PC/Mac/Laptop - Swift Grey', exact: true }).click();
     */
    async openRecordedProduct(): Promise<void> {
        const productLink = this.page.getByRole('link', {
            name: 'Logitech M185 Wireless Mouse, 2.4GHz with USB Mini Receiver, 12-Month Battery Life, 1000 DPI Optical Tracking, Ambidextrous PC/Mac/Laptop - Swift Grey',
            exact: true
        });
        await ActionUtils.clickAndNavigate(productLink, { page: this.page });
    }

    /**
     * Click "Add to cart" on the product details page.
     *
     * Recorded step mapping (Step 4):
     * await page.getByRole('button', { name: 'Add to cart', exact: true }).click();
     */
    async addToCart(): Promise<void> {
        const addToCartButton = this.page.getByRole('button', { name: 'Add to cart', exact: true });
        await ActionUtils.click(addToCartButton, { page: this.page });

        // Lightweight wait for add-to-cart confirmation area to appear.
        // (Robust helper locator; not part of recorded steps.)
        const confirmationContainer = this.page.locator('#sw-atc-details, #sw-atc-container, #attach-added-to-cart-message');
        await confirmationContainer.first().waitFor({ state: 'visible', timeout: 30000 });
    }

    /**
     * Navigate to the cart using the "Go to Cart" link in the add-to-cart confirmation area.
     *
     * Recorded step mapping (Step 5):
     * await page.locator('#sw-gtc').getByRole('link', { name: 'Go to Cart' }).click();
     */
    async goToCart(): Promise<void> {
        const goToCartLink = this.page.locator('#sw-gtc').getByRole('link', { name: 'Go to Cart' });
        await ActionUtils.clickAndNavigate(goToCartLink, { page: this.page });
    }

    /**
     * Verify the cart contains a product with the expected name and quantity.
     *
     * This uses robust cart locators (not part of recorded steps) to reduce flakiness.
     *
     * @param expectedName Expected product name (substring match).
     * @param expectedQty Expected quantity as string. Defaults to '1'.
     */
    async verifyCartHasProduct(expectedName: string, expectedQty: string = '1'): Promise<void> {
        // Ensure cart page has loaded.
        await expect(this.page).toHaveURL(/\/cart\b|\/gp\/cart\b/);

        // Product title in cart.
        const cartItemTitle: Locator = this.page.locator(
            'div.sc-list-item-content span.a-truncate-full, div.sc-list-item-content span.a-truncate-cut, span.sc-product-title'
        );
        await expect(cartItemTitle.first()).toBeVisible();
        await expect(cartItemTitle).toContainText(expectedName, { ignoreCase: true });

        // Quantity: Amazon commonly uses a select[name="quantity"] per cart line.
        const qtySelect = this.page.locator('select[name="quantity"]');
        if (await qtySelect.first().isVisible().catch(() => false)) {
            await expect(qtySelect.first()).toHaveValue(expectedQty);
            return;
        }

        // Fallback: quantity may be rendered as text.
        const qtyText = this.page.locator('span.a-dropdown-prompt, span.sc-quantity-textfield');
        await expect(qtyText.first()).toBeVisible();
        await expect(qtyText.first()).toContainText(expectedQty);
    }
}
