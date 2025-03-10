import { Page, expect } from '@playwright/test';
import { BasePage } from '../BasePage';

/**
 * CartPage handles interactions with the shopping cart.
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
    await expect(this.page.getByLabel(productName, { exact: true })).toBeVisible();
  }

  /**
   * Verify that a specific product is not in the cart
   * @param productName Name of the product to check
   */
  async verifyProductNotInCart(productName: string): Promise<void> {
    await expect(this.page.getByLabel(productName, { exact: true })).not.toBeVisible();
  }

  /**
   * Remove an item from the cart
   * @param productName Name of the product to remove
   */
  async removeItem(productName: string): Promise<void> {
    await this.page.getByLabel(`Remove ${productName}`).click();
  }

  /**
   * Verify cart is empty
   */
  async verifyCartIsEmpty(): Promise<void> {
    await expect(this.page.locator('[data-test="empty-message"]')).toContainText('You have nothing in your shopping cart.');
  }

  /**
   * Remove all items from cart using "Remove" button
   */
  async removeAllItems(): Promise<void> {
    const removeButtons = this.page.locator('[data-test="remove-item"]');
    const count = await removeButtons.count();
    
    for (let i = 0; i < count; i++) {
      // Always click the first button since they'll shift after each removal
      await removeButtons.first().click();
      // Wait for the animation to complete
      await this.page.waitForTimeout(500);
    }
  }
} 