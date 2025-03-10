import { Page } from '@playwright/test';
import { MidsceneContext } from 'midscene';
import { BasePage } from './BasePage';

/**
 * CartPage handles interactions with the shopping cart using natural language.
 * Following principles:
 * - Single responsibility
 * - Information hiding
 * - General-purpose over special-purpose interfaces
 */
export class CartPage extends BasePage {
  /**
   * Verify that a specific product exists in the cart
   * @param productName Name of the product to check
   */
  async verifyProductInCart(productName: string): Promise<void> {
    await this.aiContext.assert(`Check that the product "${productName}" is visible in the cart`);
  }

  /**
   * Verify that a specific product is not in the cart
   * @param productName Name of the product to check
   */
  async verifyProductNotInCart(productName: string): Promise<void> {
    await this.aiContext.assert(`Check that the product "${productName}" is not visible in the cart`);
  }

  /**
   * Remove an item from the cart
   * @param productName Name of the product to remove
   */
  async removeItem(productName: string): Promise<void> {
    await this.aiContext.execute(`Click on the remove button for the product "${productName}"`);
    await this.aiContext.execute(`Wait for the cart to update`);
  }

  /**
   * Verify cart is empty
   */
  async verifyCartIsEmpty(): Promise<void> {
    await this.aiContext.assert(`Check that the cart is empty with a message saying "You have nothing in your shopping cart"`);
  }

  /**
   * Remove all items from cart using "Remove" button
   */
  async removeAllItems(): Promise<void> {
    await this.aiContext.execute(`Click on all remove buttons in the cart until the cart is empty`);
    // Alternative approach if the above doesn't work well with the AI:
    // await this.aiContext.execute(`If there is a "Clear Cart" or "Remove All" button, click it. Otherwise, remove each item one by one.`);
  }

  /**
   * Get the total price of items in the cart
   */
  async getCartTotal(): Promise<string> {
    // This will be handled differently since we need to return data
    // We'll have the AI extract the information in a specific format
    const response = await this.aiContext.extract(`What is the total price of all items in the cart? Return only the number with currency symbol.`);
    return response.toString();
  }

  /**
   * Proceed to checkout
   */
  async proceedToCheckout(): Promise<void> {
    await this.aiContext.execute(`Click on the "Checkout" or "Proceed to Checkout" button`);
    await this.aiContext.execute(`Wait for the checkout page to load completely`);
  }
} 