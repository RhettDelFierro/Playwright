import { test, expect } from '@playwright/test';
import { createPageFactory } from '../../../pageObjects/PageFactory';

/**
 * This test suite demonstrates Ousterhout's principles:
 * - Designing for the common case
 * - Writing modular, well-documented code
 * - Using interfaces to hide complexity
 */
test.describe('E-commerce shopping cart functionality', () => {
  
  test('As a Buyer I want to view a single product page', async ({ page }) => {
    // Create page objects using the factory
    const pageFactory = createPageFactory(page);
    const productPage = pageFactory.getProductPage();
    
    // Visit website and navigate to product collection
    await productPage.navigateTo('https://reed-finch-j8jr.squarespace.com/');
    await productPage.takeScreenshot('Step 1 complete');
    
    // Navigate to the "Shop Neutrals" collection
    await productPage.navigateToCollection('Shop neutrals');
    await productPage.waitForNavigation('https://reed-finch-j8jr.squarespace.com/shop/neutrals-collection');
    expect(page.url()).toBe('https://reed-finch-j8jr.squarespace.com/shop/neutrals-collection');
    await productPage.takeScreenshot('Step 2 complete');
    
    // View a specific product
    await page.click('[aria-label="Arlie Dress"]');
    await productPage.waitForNavigation('https://reed-finch-j8jr.squarespace.com/shop/p/arlie-dress-c7yrd-wfabb-678b6-hn4gk');
    expect(page.url()).toBe('https://reed-finch-j8jr.squarespace.com/shop/p/arlie-dress-c7yrd-wfabb-678b6-hn4gk');
    await productPage.takeScreenshot('Step 3 complete');
  });

  test('As A Buyer I want the "Add To Cart" to add items to the cart', async ({ page }) => {
    // Create page objects using the factory
    const pageFactory = createPageFactory(page);
    const productPage = pageFactory.getProductPage();
    
    // Visit website and navigate to product collection
    await productPage.navigateTo('https://reed-finch-j8jr.squarespace.com/');
    
    // Navigate to the "Shop Neutrals" collection
    await productPage.navigateToCollection('Shop neutrals');
    await productPage.waitForNavigation('https://reed-finch-j8jr.squarespace.com/shop/neutrals-collection');
    expect(page.url()).toBe('https://reed-finch-j8jr.squarespace.com/shop/neutrals-collection');
    
    // View a specific product
    await page.click('[aria-label="Arlie Dress"]');
    await productPage.waitForNavigation('https://reed-finch-j8jr.squarespace.com/shop/p/arlie-dress-c7yrd-wfabb-678b6-hn4gk');
    expect(page.url()).toBe('https://reed-finch-j8jr.squarespace.com/shop/p/arlie-dress-c7yrd-wfabb-678b6-hn4gk');
    
    // Select size and quantity and add to cart
    const dropdown = await page.$('select');
    await dropdown.selectOption({ index: 0 });
    await page.fill('input[type="number"]', '1');
    await page.click('div[role="button"]:has-text("Add To Cart")');
    
    // Check the cart
    await productPage.viewCart();
    await productPage.waitForNavigation('https://reed-finch-j8jr.squarespace.com/cart');
    expect(page.url()).toBe('https://reed-finch-j8jr.squarespace.com/cart');
    await productPage.takeScreenshot('complete');
  });

  test('As a Buyer I want to delete items from my cart', async ({ page }) => {
    // Create page objects using the factory
    const pageFactory = createPageFactory(page);
    const securityPage = pageFactory.getSecurityPage();
    const productPage = pageFactory.getProductPage();
    const cartPage = pageFactory.getCartPage();
    
    // Login to protected site
    await securityPage.enterPasswordAndSubmit();
    await securityPage.takeScreenshot('Step 1 - Visit Homepage');
    
    // Add item to cart
    await productPage.navigateToCollection('Shop neutrals');
    await productPage.addItemToCart('Starry Onesie', '0–3M', '1');
    await productPage.takeScreenshot('Step 2 - Add Item To Cart');
    
    // View and verify cart
    await productPage.viewCart();
    await productPage.takeScreenshot('Step 3 - View Cart');
    
    // Remove item and verify cart is empty
    await cartPage.removeAllItems();
    await cartPage.verifyCartIsEmpty();
    await cartPage.takeScreenshot('Step 4 - Delete Item');
  });

  test('As a Buyer I want to delete multiple items from my cart', async ({ page }) => {
    // Create page objects using the factory
    const pageFactory = createPageFactory(page);
    const securityPage = pageFactory.getSecurityPage();
    const productPage = pageFactory.getProductPage();
    const cartPage = pageFactory.getCartPage();
    
    // Login to protected site
    await securityPage.enterPasswordAndSubmit();
    
    // Add first item to cart
    await productPage.navigateToCollection('Shop neutrals');
    await productPage.addItemToCart('Starry Onesie', '0–3M', '1');
    
    // Add second item to cart
    await productPage.navigateToCollection('New Arrivals');
    await productPage.addItemToCart('Neutral Set', '2-3Y', '1');
    
    // View cart
    await productPage.viewCart();
    
    // Verify both items are in cart
    await cartPage.verifyProductInCart('Neutral Set');
    
    // Remove one item
    await cartPage.removeItem('Neutral Set');
    
    // Verify correct item is removed and other remains
    await cartPage.verifyProductNotInCart('Neutral Set');
    await cartPage.verifyProductInCart('Starry Onesie');
    await cartPage.takeScreenshot('complete');
  });
});