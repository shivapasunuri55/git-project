import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from '@/pages/base.page';
import { ActionUtils } from '@/utils/action-utils';

/**
 * Amazon shopping page object encapsulating common shopping flows:
 * searching for a product, opening a result, adding to cart, and verifying cart contents.
 */
export class AmazonShoppingPage extends BasePage {
    private selectedProductTitle: string | undefined;

    constructor(page: Page) {
        super(page);
    }

    /**
     * Navigate to Amazon home page.
     * @param url Amazon URL to open.
     */
    async gotoHome(url: string = 'https://www.amazon.com'): Promise<void> {
        await this.navigateTo(url);
    }

    /**
     * Verify Amazon home page is loaded by asserting the search box is visible.
     */
    async verifyHomeLoaded(): Promise<void> {
        await expect(this.searchAmazonField).toBeVisible();
    }

    /**
     * Fill the Amazon search box with the query 'Wireless Mouse'.
     * Recorded step primary selector: getByRole('searchbox', { name: 'Search Amazon' })
     */
    async fillSearchAmazon(): Promise<void> {
        // await page.getByRole('searchbox', { name: 'Search Amazon' }).fill('Wireless Mouse');
        await this.page.getByRole('searchbox', { name: 'Search Amazon' }).fill('Wireless Mouse');
    }

    /**
     * Click the 'Go' search button to submit the search.
     * Recorded step primary selector: getByRole('button', { name: 'Go', exact: true })
     */
    async clickSearchGo(): Promise<void> {
        // await page.getByRole('button', { name: 'Go', exact: true }).click();
        await this.page.getByRole('button', { name: 'Go', exact: true }).click();
    }

    /**
     * Click the recorded product link in search results.
     * Note: Recording used a specific product name; tests may prefer a more robust selection strategy.
     * Recorded step primary selector: getByRole('link', { name: 'Logitech M185 Wireless Mouse, ...', exact: true })
     */
    async openRecordedProductFromResults(): Promise<void> {
        // await page.getByRole('link', { name: 'Logitech M185 Wireless Mouse, 2.4GHz with USB Mini Receiver, 12-Month Battery Life, 1000 DPI Optical Tracking, Ambidextrous PC/Mac/Laptop - Swift Grey', exact: true }).click();
        await this.page
            .getByRole('link', {
                name: 'Logitech M185 Wireless Mouse, 2.4GHz with USB Mini Receiver, 12-Month Battery Life, 1000 DPI Optical Tracking, Ambidextrous PC/Mac/Laptop - Swift Grey',
                exact: true,
            })
            .click();
    }

    /**
     * Capture the currently opened product title for later verification.
     * Stores the title internally and also returns it.
     */
    async captureSelectedProductTitle(): Promise<string> {
        // Prefer Amazon product title element when present.
        const titleLocator = this.page.locator('#productTitle');
        if (await titleLocator.count()) {
            await expect(titleLocator.first()).toBeVisible();
            const title = (await titleLocator.first().innerText()).trim();
            this.selectedProductTitle = title;
            return title;
        }

        // Fallback to page title.
        const title = (await this.page.title()).trim();
        this.selectedProductTitle = title;
        return title;
    }

    /**
     * Click 'Add to cart' on the product details page.
     * Recorded step primary selector: getByRole('button', { name: 'Add to cart', exact: true })
     */
    async clickAddToCart(): Promise<void> {
        // await page.getByRole('button', { name: 'Add to cart', exact: true }).click();
        await this.page.getByRole('button', { name: 'Add to cart', exact: true }).click();
    }

    /**
     * Click 'Go to Cart' from the add-to-cart confirmation area.
     * Recorded step primary selector: locator('#sw-gtc')
     */
    async goToCartFromConfirmation(): Promise<void> {
        // await page.locator('#sw-gtc').getByRole('link', { name: 'Go to Cart' }).click();
        await this.page.locator('#sw-gtc').getByRole('link', { name: 'Go to Cart' }).click();
    }

    /**
     * Open cart via header as a fallback when the confirmation "Go to Cart" control is not present.
     */
    async openCartViaHeader(): Promise<void> {
        // Amazon header cart link typically has id nav-cart.
        await ActionUtils.click(this.page.locator('#nav-cart'), { page: this.page });
    }

    /**
     * Verify the cart contains exactly one item with quantity 1 and (optionally) matches expected title.
     * This avoids asserting exact subtotal price.
     * @param expectedTitle Expected product title (or substring) to verify in cart.
     */
    async verifyCartHasOneItemAndQuantityOne(expectedTitle?: string): Promise<void> {
        // Ensure we are on cart page.
        await expect(this.page).toHaveURL(/\/gp\/cart\/view\.html|\/cart/i);

        // Cart items are typically rendered with data-name="Active Items" and sc-list-item.
        const cartItems = this.page.locator('[data-name="Active Items"] [data-itemtype], .sc-list-item');
        await expect(cartItems.first()).toBeVisible();

        const itemCount = await cartItems.count();
        expect(itemCount).toBe(1);

        // Quantity: Amazon often uses a select with name="quantity".
        const quantitySelect = cartItems.first().locator('select[name="quantity"]');
        if (await quantitySelect.count()) {
            await expect(quantitySelect).toHaveValue('1');
        } else {
            // Fallback: some experiences show quantity as text.
            const qtyText = cartItems.first().locator('text=/Qty\s*:\s*1/i');
            await expect(qtyText).toBeVisible();
        }

        const titleInCart = cartItems.first().locator('h4 a, .sc-product-title, [data-a-word-break]');
        await expect(titleInCart.first()).toBeVisible();

        if (expectedTitle && expectedTitle.trim().length > 0) {
            await expect(titleInCart.first()).toContainText(expectedTitle.trim(), { ignoreCase: true });
        } else if (this.selectedProductTitle) {
            // Use stored title as a best-effort check.
            await expect(titleInCart.first()).toContainText(this.selectedProductTitle, { ignoreCase: true });
        }
    }

    /**
     * Search box locator.
     */
    private get searchAmazonField(): Locator {
        return this.page.getByRole('searchbox', { name: 'Search Amazon' });
    }
}
