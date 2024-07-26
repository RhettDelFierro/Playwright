import { test, expect } from '@playwright/test';
import productPage from '../../../pageObjects/RoadToQA/passwordPage'

test('As a Buyer I want to view a single product page', async ({ page }) => {
    // <-----------------------Step 1: Visit Website------------------------------------------------------------------->
    await page.goto("https://reed-finch-j8jr.squarespace.com/");
    await page.screenshot({ path: 'Step 1 complete.png' });

    // <-----------------------Step 2: Click on the "Shop Neutrals" button: ------------------------------------------->
    await page.click('text=Shop neutrals');
    await page.waitForURL('https://reed-finch-j8jr.squarespace.com/shop/neutrals-collection');
    expect(page.url()).toBe('https://reed-finch-j8jr.squarespace.com/shop/neutrals-collection');

    await page.screenshot({ path: 'Step 2 complete.png' });

    // <-----------------------Step 3: Click on Arlie Dress------------------------------------------------------------>
    await page.click('[aria-label="Arlie Dress"]');
    await page.waitForURL('https://reed-finch-j8jr.squarespace.com/shop/p/arlie-dress-c7yrd-wfabb-678b6-hn4gk');
    expect(page.url()).toBe('https://reed-finch-j8jr.squarespace.com/shop/p/arlie-dress-c7yrd-wfabb-678b6-hn4gk');

    await page.screenshot({ path: 'Step 3 complete.png' });
});

test('As A Buyer I want the "Add To Cart" To add items to the cart', async ({ page }) => {
    // <-----------------------Step 1: Visit Website------------------------------------------------------------------->
    await page.goto("https://reed-finch-j8jr.squarespace.com/");
    // await page.screenshot({ path: 'step 1 complete.png' });

    // <-----------------------Step 2: Click on the "Shop Neutrals" button: ------------------------------------------->
    await page.click('text=Shop neutrals');
    await page.waitForURL('https://reed-finch-j8jr.squarespace.com/shop/neutrals-collection');

    let currentUrl = page.url();
    expect(currentUrl).toBe('https://reed-finch-j8jr.squarespace.com/shop/neutrals-collection');
    // await page.screenshot({ path: 'step 2 complete.png' });

    // <-----------------------Step 3: Click on Arlie Dress------------------------------------------------------------>
    await page.click('[aria-label="Arlie Dress"]');

    // Check URL/site address
    await page.waitForURL('https://reed-finch-j8jr.squarespace.com/shop/p/arlie-dress-c7yrd-wfabb-678b6-hn4gk');
    currentUrl = page.url();
    expect(currentUrl).toBe('https://reed-finch-j8jr.squarespace.com/shop/p/arlie-dress-c7yrd-wfabb-678b6-hn4gk');

    // Take a screenshot for verification
    // await page.screenshot({ path: 'step 3 complete.png' });

    // <-----------------------Step 4: Select the first option in the dropdown----------------------------------------->
    const dropdown = await page.$('select'); // Assuming there's only one select element
    await dropdown.selectOption({ index: 0 });

    // <-----------------------Step 5: Automate the Purchase----------------------------------------------------------->
    await page.fill('input[type="number"]', '1');
    await page.click('div[role="button"]:has-text("Add To Cart")');

    // Wait probably need to wait for the cart quantity to update to "1"

    // <-----------------------Step 6: Check the cart------------------------------------------------------------------>
    await page.click('.showOnDesktop .header-actions a[aria-label*="items in cart"]');
    await page.waitForURL('https://reed-finch-j8jr.squarespace.com/cart');
    currentUrl = page.url();
    expect(currentUrl).toBe('https://reed-finch-j8jr.squarespace.com/cart');

    await page.screenshot({ path: 'complete.png' });
});


test.only('As a Buyer I want to delete items from my cart /checkout using the Delete options (X / Remove)', async ({ page }) => {
    await productPage.enterPasswordAndSubmit(page)
    await page.getByRole('link', { name: 'Shop neutrals' }).click()
    await productPage.addItemToCartFromProductPage(page, 'Starry Onesie', '0–3M', '1')
    await page.getByRole('link', { name: 'One item in cart' }).click();
    await page.locator('[data-test="remove-item"]').click();
    await expect(page.locator('[data-test="empty-message"]')).toContainText('You have nothing in your shopping cart.');
    await page.screenshot({ path: 'complete.png' });
});

test('As a Buyer I want to delete items from my cart /checkout using the Delete options (X / Remove) - multiple items', async ({ page }) => {
    await productPage.enterPasswordAndSubmit(page)
    await page.getByRole('link', { name: 'Shop neutrals' }).click()
    await productPage.addItemToCartFromProductPage(page, 'Starry Onesie', '0–3M', '1')
    await page.getByRole('link', { name: 'New Arrivals' }).click();
    await productPage.addItemToCartFromProductPage(page, 'Neutral Set', '2-3Y', '1')
    await page.getByRole('link', { name: 'items in cart' }).click();
    await expect(page.getByLabel('Neutral Set', { exact: true })).toBeVisible();
    await page.getByLabel('Remove Neutral Set').click();
    await expect(page.getByLabel('Neutral Set', { exact: true })).not.toBeVisible();
    await expect(page.getByLabel('Starry Onesie', { exact: true })).toBeVisible();
    await page.screenshot({ path: 'complete.png' });
});