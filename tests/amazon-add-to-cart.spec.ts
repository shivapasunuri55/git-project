/**
 * Scenario: Amazon - search wireless mouse and add to cart
 *
 * Expectations:
 * - Amazon homepage loads successfully and search box is visible.
 * - Searching for "Wireless Mouse" returns results.
 * - Opens the recorded product (Logitech M185) from results (note: this is a recorded specific item,
 *   which may differ from "first non-sponsored" behavior).
 * - Adds the product to cart, navigates to cart, and verifies the cart contains the expected product
 *   with quantity 1.
 */

import { test, expect } from '../test-setup/fixtures';
import { AmazonPage } from '../src/pages/amazon.page';

test('Amazon - search wireless mouse and add to cart', async ({ page, logger }) => {
  const amazonPage = new AmazonPage(page);

  logger.info('Navigating to Amazon home page');
  await amazonPage.navigateToHome();

  logger.info('Verifying Amazon homepage loaded');
  await expect(page).toHaveTitle(/Amazon/i);
  await expect(page.url()).toContain('amazon.com');
  await expect(page.getByRole('searchbox', { name: 'Search Amazon' })).toBeVisible();

  logger.info('Searching for product: Wireless Mouse');
  await amazonPage.searchForProduct('Wireless Mouse');

  logger.info('Submitting search');
  await amazonPage.submitSearch();

  logger.info('Opening recorded product from search results (recorded specific item)');
  await amazonPage.openRecordedProduct();

  logger.info('Adding product to cart');
  await amazonPage.addToCart();

  logger.info('Going to cart');
  await amazonPage.goToCart();

  logger.info('Verifying cart has expected product and quantity');
  await amazonPage.verifyCartHasOneItem('Logitech M185', 1);
});
