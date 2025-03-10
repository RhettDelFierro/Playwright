import { Page } from '@playwright/test';
import { MidsceneContext } from 'midscene';
import { BasePage } from './BasePage';

/**
 * ProductPage handles interactions with product pages using natural language.
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
    await this.aiContext.execute(`Select the size "${size}" from the dropdown`);
    await this.aiContext.execute(`Set the quantity to "${quantity}"`);
  }

  /**
   * Add an item to the cart from a product page
   * @param productName Name of the product to select
   * @param size Size to select
   * @param quantity Quantity to add
   */
  async addItemToCart(productName: string, size: string, quantity: string): Promise<void> {
    await this.aiContext.execute(`Click on the product named "${productName}"`);
    await this.selectSizeAndQuantity(size, quantity);
    await this.aiContext.execute(`Click on the "Add To Cart" button`);
    
    // Verify item was added
    await this.aiContext.assert(`Check that a confirmation appears indicating the item was added to cart`);
  }

  /**
   * Navigate to a specific product collection
   * @param collectionName Name of the collection to navigate to
   */
  async navigateToCollection(collectionName: string): Promise<void> {
    await this.aiContext.execute(`Click on the link that says "${collectionName}"`);
    await this.aiContext.execute(`Wait for the collection page to load completely`);
  }

  /**
   * View cart contents
   */
  async viewCart(): Promise<void> {
    await this.aiContext.execute(`Click on the cart icon or link`);
    await this.aiContext.execute(`Wait for the cart page to load completely`);
  }

  /**
   * Verify product exists on the current page
   * @param productName Name of the product to verify
   */
  async verifyProductExists(productName: string): Promise<void> {
    await this.aiContext.assert(`Check that a product named "${productName}" exists on the page`);
  }

  /**
   * Verify product has correct price
   * @param productName Name of the product
   * @param expectedPrice Expected price as a string
   */
  async verifyProductPrice(productName: string, expectedPrice: string): Promise<void> {
    await this.aiContext.assert(`Check that the product "${productName}" has a price of "${expectedPrice}"`);
  }
} 