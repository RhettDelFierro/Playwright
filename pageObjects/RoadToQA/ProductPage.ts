import { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

/**
 * ProductPage handles interactions with product pages.
 * Following Ousterhout's principles:
 * - Modules should be deep (simple interface, complex functionality)
 * - Define errors out of existence where possible
 * - Separate general-purpose and special-purpose code
 */
export class ProductPage extends BasePage {
  /**
   * Select product size and quantity
   * @param size Size to select
   * @param quantity Quantity to enter
   * @private Private method demonstrates information hiding
   */
  private async selectSizeAndQuantity(size: string, quantity: string): Promise<void> {
    await this.page.getByLabel('Select Size').selectOption(size);
    await this.page.getByLabel('Quantity').click();
    await this.page.getByLabel('Quantity').fill(quantity);
  }

  /**
   * Add an item to the cart from a product page
   * @param productLabel Label of the product to select
   * @param size Size to select
   * @param quantity Quantity to add
   */
  async addItemToCart(productLabel: string, size: string, quantity: string): Promise<void> {
    await this.page.getByLabel(productLabel).click();
    await this.selectSizeAndQuantity(size, quantity);
    await this.page.getByRole('button', { name: 'Add To Cart' }).click();
  }

  /**
   * Navigate to a specific product collection
   * @param collectionName Name of the collection to navigate to
   */
  async navigateToCollection(collectionName: string): Promise<void> {
    await this.page.getByRole('link', { name: collectionName }).click();
  }

  /**
   * View cart contents
   */
  async viewCart(): Promise<void> {
    await this.page.getByRole('link', { name: /items? in cart/i }).click();
  }

  /**
   * Remove an item from the cart
   * @param productName Name of the product to remove
   */
  async removeItemFromCart(productName: string): Promise<void> {
    await this.page.getByLabel(`Remove ${productName}`).click();
  }
} 