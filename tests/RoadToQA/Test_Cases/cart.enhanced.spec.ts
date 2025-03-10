/**
 * Enhanced Shopping Cart Tests
 * 
 * Demonstrates the fully modular architecture following Ousterhout's principles:
 * - Uses dependency injection
 * - Applies component-based modeling
 * - Employs test context for state management
 * - Uses data-driven testing
 */

import { test as baseTest, expect, Page } from '@playwright/test';
import { container } from '../../../utils/di-container';
import { logger } from '../../../utils/logger';
import { tryWithErrorHandling } from '../../../utils/errors';
import { dataStore, getProduct, getUser } from '../../../testData';
import { ProductPage } from '../../../pageObjects/enhanced/ProductPage';
import config from '../../../configurations/config';

// Create test context interface for sharing state between tests
interface TestContext {
  productPage: ProductPage;
  addedProducts: string[];
}

// Define test fixtures with context
const test = baseTest.extend<TestContext>({
  // Create a context that is shared between tests
  productPage: async ({ page }, use) => {
    // Register dependencies if not already registered
    if (!container.has('productPage')) {
      container.register('productPage', (page: Page) => {
        return new ProductPage(page);
      });
    }
    
    // Resolve the product page instance
    const productPage = container.resolve<ProductPage>('productPage', page);
    await use(productPage);
  },
  
  // Track added products for cleanup between tests
  addedProducts: async ({}, use) => {
    const products: string[] = [];
    await use(products);
  }
});

// Setup and teardown for test suite
test.beforeAll(async () => {
  logger.info('Starting enhanced shopping cart tests', { environment: config.environment });
});

test.afterAll(async () => {
  logger.info('Completed enhanced shopping cart tests');
});

// Setup for each test
test.beforeEach(async ({ page, productPage }) => {
  logger.info('Setting up test');
  
  // Navigate to home page
  await tryWithErrorHandling(
    async () => await productPage.navigateTo(config.baseUrl),
    { 
      retries: 2,
      errorMessage: 'Failed to navigate to home page'
    }
  );
});

// Clean up after each test
test.afterEach(async ({ page, productPage, addedProducts }) => {
  logger.info('Cleaning up test', { addedProducts });
  
  // Remove products from cart if any were added
  if (addedProducts.length > 0) {
    await tryWithErrorHandling(async () => {
      await productPage.viewCart();
      
      // Cart page cleanup could be implemented here
      // We'd create a CartPage instance and call removeAllItems()
      
      addedProducts.length = 0; // Clear the array
    }, {
      retries: 1,
      errorMessage: 'Failed to clean up test cart',
      fallback: undefined // Continue even if cleanup fails
    });
  }
});

// Test cases
test.describe('Cart functionality', () => {
  test('As a buyer I want to view a product details page', async ({ productPage }) => {
    // Get product data from the test data store
    const product = getProduct('Arlie Dress');
    
    // Navigate to collection
    await productPage.navigateToCollection('Shop neutrals');
    
    // Verify collection page loaded
    const url = await productPage.getCurrentUrl();
    expect(url).toContain('neutrals-collection');
    
    // Click on specific product using test data
    await test.step('Click on product', async () => {
      await productPage.page.getByText(product?.name || 'Arlie Dress').click();
      await productPage.waitForPageLoad();
    });
    
    // Verify product details
    await test.step('Verify product details', async () => {
      const details = await productPage.getProductDetails();
      expect(details.name).toContain(product?.name || 'Arlie Dress');
    });
    
    await productPage.takeScreenshot('product-details');
  });
  
  test('As a buyer I want to add products to my cart', async ({ productPage, addedProducts }) => {
    // Navigate to collection
    await productPage.navigateToCollection('Shop neutrals');
    
    // Add product to cart
    const productName = 'Starry Onesie';
    const size = '0–3M';
    const quantity = '1';
    
    await test.step('Add product to cart', async () => {
      await productPage.addItemToCart(productName, size, quantity);
      addedProducts.push(productName); // Track for cleanup
    });
    
    // View cart
    await test.step('View cart', async () => {
      await productPage.viewCart();
    });
    
    // Verify product is in cart
    await test.step('Verify product in cart', async () => {
      // Here we would call cartPage.verifyProductInCart(productName)
      // For now, use page locator directly
      const productInCart = await productPage.page.getByText(productName).isVisible();
      expect(productInCart).toBeTruthy();
    });
    
    await productPage.takeScreenshot('product-in-cart');
  });
  
  test('As a buyer I want to add multiple products to my cart', async ({ productPage, addedProducts }) => {
    // Navigate to first collection and add product
    await test.step('Add first product', async () => {
      await productPage.navigateToCollection('Shop neutrals');
      await productPage.addItemToCart('Starry Onesie', '0–3M', '1');
      addedProducts.push('Starry Onesie');
    });
    
    // Navigate to second collection and add product
    await test.step('Add second product', async () => {
      await productPage.navigateToCollection('New Arrivals');
      await productPage.addItemToCart('Neutral Set', '2-3Y', '1');
      addedProducts.push('Neutral Set');
    });
    
    // View cart
    await test.step('View cart', async () => {
      await productPage.viewCart();
    });
    
    // Verify both products are in cart
    await test.step('Verify products in cart', async () => {
      const firstProductInCart = await productPage.page.getByText('Starry Onesie').isVisible();
      const secondProductInCart = await productPage.page.getByText('Neutral Set').isVisible();
      
      expect(firstProductInCart).toBeTruthy();
      expect(secondProductInCart).toBeTruthy();
    });
    
    await productPage.takeScreenshot('multiple-products-in-cart');
  });
});

// Using test.describe for better organization
test.describe('Data-driven product tests', () => {
  // Define test data
  const testProducts = [
    { name: 'Starry Onesie', size: '0–3M', quantity: '1', collection: 'Shop neutrals' },
    { name: 'Neutral Set', size: '2-3Y', quantity: '1', collection: 'New Arrivals' }
  ];
  
  // Data-driven test
  for (const product of testProducts) {
    test(`Add ${product.name} to cart from ${product.collection}`, async ({ productPage, addedProducts }) => {
      // Navigate to collection
      await productPage.navigateToCollection(product.collection);
      
      // Add product to cart
      await productPage.addItemToCart(product.name, product.size, product.quantity);
      addedProducts.push(product.name);
      
      // View cart
      await productPage.viewCart();
      
      // Verify product is in cart
      const productInCart = await productPage.page.getByText(product.name).isVisible();
      expect(productInCart).toBeTruthy();
      
      await productPage.takeScreenshot(`${product.name.toLowerCase().replace(/\s+/g, '-')}-in-cart`);
    });
  }
}); 