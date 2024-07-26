import { Page } from '@playwright/test';

const productPage = {
    async enterPasswordAndSubmit(page: Page) {
        await page.goto('https://nectarine-pomegranate-rleh.squarespace.com/retest');
        await page.getByPlaceholder('Password').click();
        await page.getByPlaceholder('Password').fill('teziiqa2');
        await page.getByLabel('Submit').click();
    },
    async _selectSizeAndQuantity(page: Page, size: string, amount: string,) {
        await page.getByLabel('Select Size').selectOption(size);
        await page.getByLabel('Quantity').click();
        await page.getByLabel('Quantity').fill(amount);
    },
    async addItemToCartFromProductPage(page: Page, label: string, size: string, quantity: string) {
        await page.getByLabel(label).click();
        await this._selectSizeAndQuantity(page, size, quantity)
        await page.getByRole('button', { name: 'Add To Cart' }).click();
    }
};

export default productPage;
