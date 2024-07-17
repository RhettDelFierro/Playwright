import { test, expect } from '@playwright/test';

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

test.skip('As A Buyer I want the "Add To Cart" To add items to the cart', async ({ page }) => {
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

    // <-----------------------Step 5: Fill in the quantity as 1-------------------------------------------------------->
    await page.fill('input[type="number"]', '1');
    await page.click('div[role="button"]:has-text("Add To Cart")');

    // Wait for the cart quantity to update to "1"
    // await page.waitForFunction(() => {
    //     const cartQuantityElement = document.querySelector('span.sqs-cart-quantity');
    //     return cartQuantityElement && cartQuantityElement.textContent.trim() === '1';
    // }, { timeout: 30000 });

    // <-----------------------Step 7: Click on the cart icon to navigate to the cart page---------------------------->
    await page.click('.showOnDesktop .header-actions a[aria-label*="items in cart"]');

    // Wait for the cart page to load
    await page.waitForURL('https://reed-finch-j8jr.squarespace.com/cart');
    currentUrl = page.url();
    expect(currentUrl).toBe('https://reed-finch-j8jr.squarespace.com/cart');

    // Take a screenshot for verification
    await page.screenshot({ path: 'complete.png' });
});
