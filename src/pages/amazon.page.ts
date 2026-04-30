import { expect, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { ActionUtils } from '../utils/action-utils';

/**
 * AmazonPage encapsulates common Amazon shopping flows used by tests.
 *
 * This page object follows the project pattern of extending {@link BasePage}
 * and using {@link ActionUtils} for stable interactions and reporting.
 */
export class AmazonPage extends BasePage {
  /**
   * Creates an instance of AmazonPage.
   *
   * @param page Playwright {@link Page} instance.
   */
  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigates to the Amazon home page.
   *
   * @param url Target URL (defaults to https://www.amazon.com).
   */
  async navigateToHome(url: string = 'https://www.amazon.com'): Promise<void> {
    await this.navigateTo(url);
  }

  /**
   * Fills the Amazon search box with the provided query.
   *
   * Locator (recorded): getByRole('searchbox', { name: 'Search Amazon' })
   *
   * @param query Product search query.
   */
  async searchForProduct(query: string): Promise<void> {
    const searchBox = this.page.getByRole('searchbox', { name: 'Search Amazon' });
    await ActionUtils.fill(searchBox, query, { page: this.page });
  }

  /**
   * Submits the search by clicking the "Go" button.
   *
   * Locator (recorded): getByRole('button', { name: 'Go', exact: true })
   */
  async submitSearch(): Promise<void> {
    const goButton = this.page.getByRole('button', { name: 'Go', exact: true });
    await ActionUtils.clickAndNavigate(goButton, { page: this.page });
  }

  /**
   * Opens the recorded product from the search results.
   *
   * Note: This uses the recorded product link name.
   */
  async openRecordedProduct(): Promise<void> {
    const productLink = this.page.getByRole('link', {
      name: 'Logitech M185 Wireless Mouse, 2.4GHz with USB Mini Receiver, 12-Month Battery Life, 1000 DPI Optical Tracking, Ambidextrous PC/Mac/Laptop - Swift Grey',
      exact: true
    });
    await ActionUtils.clickAndNavigate(productLink, { page: this.page });
  }

  /**
   * Clicks the "Add to cart" button on the product details page.
   */
  async addToCart(): Promise<void> {
    const addToCartButton = this.page.getByRole('button', { name: 'Add to cart', exact: true });
    await ActionUtils.click(addToCartButton, { page: this.page });
  }

  /**
   * Navigates to the cart using the "Go to Cart" link in the add-to-cart confirmation area.
   */
  async goToCart(): Promise<void> {
    const goToCartLink = this.page.locator('#sw-gtc').getByRole('link', { name: 'Go to Cart' });
    await ActionUtils.clickAndNavigate(goToCartLink, { page: this.page });
  }

  /**
   * Verifies the cart contains the expected product and quantity.
   *
   * Robust checks implemented:
   * - Subtotal text contains "(X item" (handles "item"/"items")
   * - Quantity dropdown/input reflects expected quantity
   * - Product title contains expected product name
   *
   * @param expectedProductName Expected product name (substring match).
   * @param expectedQty Expected quantity (defaults to 1).
   */
  async verifyCartHasOneItem(expectedProductName: string, expectedQty: number = 1): Promise<void> {
    // Subtotal area commonly contains "Subtotal (1 item):".
    const subtotal = this.page.locator('#sc-subtotal-label-activecart, #sc-subtotal-label-buybox');
    await expect(subtotal).toContainText(`(${expectedQty} item`);

    // Quantity is typically a select with name "Quantity".
    const qtySelect = this.page.getByRole('combobox', { name: 'Quantity' }).first();
    await expect(qtySelect).toHaveValue(String(expectedQty));

    // Product title in cart.
    const productTitle = this.page.locator('span.sc-product-title');
    await expect(productTitle.first()).toContainText(expectedProductName);
  }
}
