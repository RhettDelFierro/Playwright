import { test, expect } from '@playwright/test';
import { MidsceneFixtures, getMidsceneFixtures, EcommerceWorkflows } from '../utils/test-helpers';

/**
 * This test suite demonstrates Ousterhout's principles with natural language:
 * - Designing for the common case
 * - Writing modular, well-documented code
 * - Using interfaces to hide complexity
 * - Using natural language to improve test readability
 */
test.describe('E-commerce shopping cart functionality with natural language', () => {
  // Define shared workflow object
  let workflows: EcommerceWorkflows;
  
  // Set up before each test
  test.beforeEach(async ({ page }, testInfo) => {
    // Get Midscene fixtures
    const { ai, aiAssert } = getMidsceneFixtures();
    
    // Create workflows helper
    workflows = new EcommerceWorkflows(page, ai, aiAssert);
    
    // Log test name for reporting
    console.log(`Running test: ${testInfo.title}`);
  });
  
  // Tests start here
  test('As a Buyer I want to view a single product page', async ({ page }) => {
    // Get Midscene fixtures for direct use
    const { ai, aiAssert } = getMidsceneFixtures();
    
    // Visit website
    await workflows.navigateToHomepage();
    await workflows.takeScreenshot('Step 1 complete');
    
    // Navigate to the "Shop Neutrals" collection
    await workflows.getProductPage().navigateToCollection('Shop neutrals');
    await workflows.takeScreenshot('Step 2 complete');
    
    // View a specific product - using pure natural language
    await ai('Click on the product labeled "Arlie Dress"');
    await ai('Wait for the product page to fully load');
    await aiAssert('Check that the page displays the Arlie Dress product');
    
    await workflows.takeScreenshot('Step 3 complete');
  });

  test('As A Buyer I want to add items to the cart', async ({ page }) => {
    // Get Midscene fixtures for direct use
    const { ai, aiAssert } = getMidsceneFixtures();
    
    // Visit website and navigate to product collection
    await workflows.navigateToHomepage();
    await workflows.getProductPage().navigateToCollection('Shop neutrals');
    
    // View a specific product
    await ai('Click on the "Arlie Dress" product');
    await ai('Wait for the product details to load');
    
    // Select size and quantity and add to cart
    await ai('Select the first size option from the dropdown menu');
    await ai('Set the quantity to 1');
    await ai('Click the "Add To Cart" button');
    
    // Check the cart
    await workflows.viewCart();
    await aiAssert('Check that the cart contains the Arlie Dress product');
    await workflows.takeScreenshot('complete');
  });

  test('As a Buyer I want to delete items from my cart', async ({ page }) => {
    // Login and add item to cart
    await workflows.login();
    await workflows.takeScreenshot('Step 1 - Visit Homepage');
    
    // Add item to cart using helper function
    await workflows.addProductToCart('Shop neutrals', 'Starry Onesie', '0–3M', '1');
    await workflows.takeScreenshot('Step 2 - Add Item To Cart');
    
    // View and verify cart
    await workflows.viewCart();
    await workflows.takeScreenshot('Step 3 - View Cart');
    
    // Remove item and verify cart is empty
    await workflows.getCartPage().removeAllItems();
    await workflows.getCartPage().verifyCartIsEmpty();
    await workflows.takeScreenshot('Step 4 - Delete Item');
  });

  test('As a Buyer I want to delete multiple items from my cart', async ({ page }) => {
    // Login to protected site
    await workflows.login();
    
    // Add multiple items to cart
    await workflows.addProductToCart('Shop neutrals', 'Starry Onesie', '0–3M', '1');
    await workflows.addProductToCart('New Arrivals', 'Neutral Set', '2-3Y', '1');
    
    // View cart
    await workflows.viewCart();
    
    // Verify both items are in cart
    await workflows.verifyProductInCart('Neutral Set');
    
    // Remove one item
    await workflows.removeProductFromCart('Neutral Set');
    
    // Verify correct item is removed and other remains
    await workflows.verifyProductNotInCart('Neutral Set');
    await workflows.verifyProductInCart('Starry Onesie');
    await workflows.takeScreenshot('complete');
  });

  // This test showcases how natural language can handle visual verification
  test('As a Buyer I want to verify product colors match description', async ({ page }) => {
    // Get Midscene fixtures for direct use
    const { ai, aiAssert } = getMidsceneFixtures();
    
    // Login to protected site
    await workflows.login();
    
    // Navigate to product collection and find a specific product
    await workflows.getProductPage().navigateToCollection('Shop neutrals');
    await ai('Click on a product with a beige or neutral color');
    
    // Now verify the color matches the description using natural language
    await aiAssert('Check that the product color matches its description as a neutral tone');
    await aiAssert('Check that the product images show consistent coloring across all angles');
    
    await workflows.takeScreenshot('color-verification');
  });
  
  // Example of a complete purchase flow test
  test('As a Buyer I want to complete a purchase', async ({ page }) => {
    // Login to protected site
    await workflows.login();
    
    // Add a product to cart
    await workflows.addProductToCart('Shop neutrals', 'Starry Onesie', '0–3M', '1');
    
    // View cart
    await workflows.viewCart();
    
    // Verify product is in cart
    await workflows.verifyProductInCart('Starry Onesie');
    
    // Complete the purchase with default payment method
    await workflows.completePurchase();
    
    // Take a screenshot of the confirmation
    await workflows.takeScreenshot('purchase-confirmation');
  });
}); 