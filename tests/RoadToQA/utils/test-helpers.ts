import { test } from '@playwright/test';
import { createPageFactory } from '../../../pageObjects/NaturalLanguage/PageFactory';

/**
 * Type definition for Midscene fixtures
 */
export type MidsceneFixtures = {
  ai: (instruction: string) => Promise<void>;
  aiAssert: (assertion: string) => Promise<void>;
};

/**
 * Get Midscene fixtures from test info
 * This function extracts ai and aiAssert functions from test context
 */
export function getMidsceneFixtures(): MidsceneFixtures {
  return test.info().annotations as unknown as MidsceneFixtures;
}

/**
 * Common E-commerce test workflows encapsulated in reusable functions
 * Following the "deep modules" principle from Ousterhout
 */
export class EcommerceWorkflows {
  private securityPage;
  private productPage;
  private cartPage;

  constructor(page, ai, aiAssert) {
    const pageFactory = createPageFactory(page, { 
      execute: ai, 
      assert: aiAssert, 
      extract: async (query) => '' 
    });
    
    this.securityPage = pageFactory.getSecurityPage();
    this.productPage = pageFactory.getProductPage();
    this.cartPage = pageFactory.getCartPage();
  }

  /**
   * Navigate to homepage
   */
  async navigateToHomepage() {
    await this.productPage.navigateTo('https://reed-finch-j8jr.squarespace.com/');
  }

  /**
   * Login to the protected site
   */
  async login() {
    await this.securityPage.enterPasswordAndSubmit();
  }

  /**
   * Add a product to cart
   */
  async addProductToCart(collectionName: string, productName: string, size: string, quantity: string) {
    await this.productPage.navigateToCollection(collectionName);
    await this.productPage.addItemToCart(productName, size, quantity);
  }

  /**
   * View shopping cart
   */
  async viewCart() {
    await this.productPage.viewCart();
  }

  /**
   * Remove product from cart
   */
  async removeProductFromCart(productName: string) {
    await this.cartPage.removeItem(productName);
  }

  /**
   * Verify product exists in cart
   */
  async verifyProductInCart(productName: string) {
    await this.cartPage.verifyProductInCart(productName);
  }

  /**
   * Verify product is not in cart
   */
  async verifyProductNotInCart(productName: string) {
    await this.cartPage.verifyProductNotInCart(productName);
  }

  /**
   * Complete purchase workflow
   */
  async completePurchase(paymentMethod: string = 'credit card') {
    await this.cartPage.proceedToCheckout();
    
    // Get aiContext from cartPage to use natural language for checkout
    const { aiContext } = this.cartPage as any;
    
    await aiContext.execute(`Fill in all required shipping information fields with valid data`);
    await aiContext.execute(`Select ${paymentMethod} as the payment method`);
    await aiContext.execute(`Fill in valid payment details`);
    await aiContext.execute(`Click the "Place Order" button`);
    await aiContext.assert(`Check that the order confirmation page appears`);
  }

  /**
   * Take screenshot with descriptive name
   */
  async takeScreenshot(name: string) {
    await this.productPage.takeScreenshot(name);
  }

  // Getters for page objects if needed directly
  getSecurityPage() { return this.securityPage; }
  getProductPage() { return this.productPage; }
  getCartPage() { return this.cartPage; }
} 