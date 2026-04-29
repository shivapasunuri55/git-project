import { test, expect } from '@test-setup/fixtures';
import { AmazonPage } from '@/pages/amazon.page';
import { TestDataUtils } from '@/utils/test-data-utils';

test('Amazon search -> add to cart -> verify cart', async ({ page, logger, allureReporter, testBase }) => {
    const amazonPage = new AmazonPage(page);

    const searchTerm: string = TestDataUtils.hasTestDataKey('amazonSearchTerm')
        ? (TestDataUtils.getTestData('amazonSearchTerm') as string)
        : 'Wireless Mouse';

    const expectedProductName: string = TestDataUtils.hasTestDataKey('amazonExpectedProductName')
        ? (TestDataUtils.getTestData('amazonExpectedProductName') as string)
        : 'Logitech M185 Wireless Mouse';

    await test.step('Navigate to Amazon home', async () => {
        logger.info('Navigating to Amazon home page');
        allureReporter.addStep('Navigating to Amazon home page');
        await amazonPage.navigateToHome('https://www.amazon.com');
    });

    await test.step('Verify Amazon home loaded', async () => {
        logger.info('Verifying Amazon home page loaded');
        allureReporter.addStep('Verifying Amazon home page loaded');

        await amazonPage.verifyHomeLoaded();
        await expect(page).toHaveTitle(/Amazon/i);
    });

    await test.step(`Search for product: ${searchTerm}`, async () => {
        logger.info(`Searching for product: ${searchTerm}`);
        allureReporter.addStep(`Searching for product: ${searchTerm}`);

        await amazonPage.fillSearch(searchTerm);
        await amazonPage.submitSearch();
    });

    await test.step('Open first recorded non-sponsored product', async () => {
        logger.info('Opening recorded product from search results');
        allureReporter.addStep('Opening recorded product from search results');

        await amazonPage.openRecordedProduct();
    });

    await test.step('Add product to cart', async () => {
        logger.info('Adding product to cart');
        allureReporter.addStep('Adding product to cart');

        await amazonPage.addToCart();
    });

    await test.step('Go to cart', async () => {
        logger.info('Navigating to cart');
        allureReporter.addStep('Navigating to cart');

        await amazonPage.goToCart();
    });

    await test.step('Verify cart has expected product and quantity 1', async () => {
        logger.info(`Verifying cart contains product: ${expectedProductName} with quantity 1`);
        allureReporter.addStep(`Verifying cart contains product: ${expectedProductName} with quantity 1`);

        await amazonPage.verifyCartHasProduct(expectedProductName, '1');
    });

    // Keep TestBase referenced to ensure fixture lifecycle is active for this test.
    expect(testBase.pageInstance).toBeTruthy();
});
