import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { ActionUtils } from '../utils/action-utils';

/**
 * StoresPage encapsulates the Stores flow.
 *
 * Covered steps:
 * 1) Open Stores
 * 2) Enter City/Pincode
 * 3) Click Find Stores
 * 4) Click first Get Direction
 * 5) Verify Directions visible
 */
export class StoresPage extends BasePage {
    /**
     * Creates an instance of StoresPage.
     *
     * @param page Playwright Page instance injected by the test.
     */
    constructor(page: Page) {
        super(page);
    }

    /** Stores link/icon. */
    private readonly storesLink = this.page.getByRole('link', { name: 'Stores', exact: true });

    /** City / Pincode textbox. */
    private readonly cityOrPincodeTextbox = this.page.getByRole('textbox');

    /** Find Stores button. */
    private readonly findStoresButton = this.page.getByRole('button', { name: 'Find Stores' });

    /** Get Direction link (first result). */
    private readonly firstGetDirectionLink = this.page.getByRole('link', { name: 'Get Direction' }).first();

    /**
     * Click the 'Stores' link/icon to open the Stores page/section.
     */
    async openStores(): Promise<void> {
        // Recorded step: await page.getByRole('link', { name: 'Stores', exact: true }).click();
        await ActionUtils.click(this.storesLink, { page: this.page });
    }

    /**
     * Enter a city or pincode into the City / Pincode textbox.
     *
     * @param pincode Pincode/city value to enter.
     */
    async enterCityOrPincode(pincode: string): Promise<void> {
        // Recorded step: await page.getByRole('textbox').fill('500085');
        await ActionUtils.fill(this.cityOrPincodeTextbox, pincode, { page: this.page });
    }

    /**
     * Click the 'Find Stores' button.
     */
    async clickFindStores(): Promise<void> {
        // Recorded step: await page.getByRole('button', { name: 'Find Stores' }).click();
        await ActionUtils.click(this.findStoresButton, { page: this.page });
    }

    /**
     * Click the first 'Get Direction' link for a listed store.
     */
    async clickFirstGetDirection(): Promise<void> {
        // Recorded step: await page.getByRole('link', { name: 'Get Direction' }).first().click();
        await ActionUtils.click(this.firstGetDirectionLink, { page: this.page });
    }

    /**
     * Verify the user can see the 'Directions' UI after clicking Get Direction.
     *
     * Since the recorded step did not include a selector, this method defaults to
     * asserting visibility of text containing "Directions". If the application DOM
     * differs, pass a locator override.
     *
     * @param directionsLocatorOverride Optional locator to assert instead of the default text-based locator.
     */
    async verifyDirectionsVisible(directionsLocatorOverride?: Locator): Promise<void> {
        const directionsLocator = directionsLocatorOverride ?? this.page.getByText('Directions', { exact: false });
        await expect(directionsLocator).toBeVisible();
    }
}
