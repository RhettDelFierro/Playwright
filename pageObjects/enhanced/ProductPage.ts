/**
 * Product Page implementation using the enhanced component-based approach
 * 
 * Following Ousterhout's principles:
 * - Using composition over inheritance
 * - Creating deep modules with simple interfaces
 * - Hiding implementation details
 */

import { Page } from '@playwright/test';
import EnhancedBasePage from '../EnhancedBasePage';
import Button from '../components/Button';
import Input from '../components/Input';
import Dropdown from '../components/Dropdown';
import { logger } from '../../utils/logger';
import { tryWithErrorHandling } from '../../utils/errors';
import { Product } from '../../testData';

/**
 * Product page component selectors
 */
const selectors = {
  // Product details
  productTitle: 'h1.product-title',
  productPrice: '.product-price',
  productDescription: '.product-description',
  
  // Selection components
  sizeDropdown: 'select[aria-label="Select Size"]',
  colorOptions: '.color-options .color-swatch',
  quantityInput: 'input[aria-label="Quantity"]',
  
  // Action buttons
  addToCartButton: 'button[aria-label="Add To Cart"], div[role="button"]:has-text("Add To Cart")',
  backToCollectionButton: 'a:has-text("Back to Collection")',
  
  // Cart related
  cartIcon: 'a[aria-label*="items in cart"], .header-actions a:has-text("cart")',
  cartItemCount: '.cart-count',
  
  // Navigation
  collectionLinks: {
    shopNeutrals: 'a:has-text("Shop neutrals")',
    newArrivals: 'a:has-text("New Arrivals")'
  }
};

/**
 * Enhanced ProductPage using component composition
 */
export class ProductPage extends EnhancedBasePage {
  // Component references
  private sizeDropdown!: Dropdown;
  private quantityInput!: Input;
  private addToCartButton!: Button;
  private cartButton!: Button;
  
  /**
   * Create a new ProductPage
   */
  constructor(page: Page, url: string = '') {
    super(page, url, 'Product');
  }
  
  /**
   * Initialize page components
   */
  protected initializeComponents(): void {
    // Selection components
    this.sizeDropdown = this.createDropdown('sizeDropdown', selectors.sizeDropdown);
    this.quantityInput = this.createInput('quantityInput', selectors.quantityInput);
    
    // Action buttons
    this.addToCartButton = this.createButton('addToCartButton', selectors.addToCartButton);
    this.cartButton = this.createButton('cartButton', selectors.cartIcon);
    
    // Navigation buttons
    this.createButton('shopNeutralsLink', selectors.collectionLinks.shopNeutrals);
    this.createButton('newArrivalsLink', selectors.collectionLinks.newArrivals);
    this.createButton('backToCollectionButton', selectors.backToCollectionButton);
  }
  
  /**
   * Navigate to a specific product
   */
  async navigateToProduct(productUrl: string): Promise<void> {
    await this.navigateTo(productUrl);
  }
  
  /**
   * Navigate to a specific collection
   */
  async navigateToCollection(collectionName: string): Promise<void> {
    logger.info(`Navigating to collection: ${collectionName}`);
    
    await tryWithErrorHandling(async () => {
      // Map collection name to component
      let buttonName: string;
      
      switch (collectionName.toLowerCase()) {
        case 'shop neutrals':
          buttonName = 'shopNeutralsLink';
          break;
        case 'new arrivals':
          buttonName = 'newArrivalsLink';
          break;
        default:
          throw new Error(`Unknown collection: ${collectionName}`);
      }
      
      const button = this.getComponent<Button>(buttonName);
      await button.click();
      await this.waitForPageLoad();
    }, {
      errorMessage: `Failed to navigate to collection: ${collectionName}`,
      retries: 1
    });
  }
  
  /**
   * Select a product size
   */
  async selectSize(size: string): Promise<void> {
    logger.info(`Selecting product size: ${size}`);
    
    await tryWithErrorHandling(async () => {
      await this.sizeDropdown.waitForVisible();
      
      if (await this.sizeDropdown.hasOption(size)) {
        await this.sizeDropdown.selectByText(size);
      } else {
        logger.warn(`Size ${size} not available, selecting first option`);
        await this.sizeDropdown.selectByIndex(0);
      }
    }, {
      errorMessage: `Failed to select size: ${size}`,
      retries: 1
    });
  }
  
  /**
   * Set the product quantity
   */
  async setQuantity(quantity: string): Promise<void> {
    logger.info(`Setting product quantity: ${quantity}`);
    
    await tryWithErrorHandling(async () => {
      await this.quantityInput.waitForVisible();
      await this.quantityInput.fill(quantity);
    }, {
      errorMessage: `Failed to set quantity: ${quantity}`,
      retries: 1
    });
  }
  
  /**
   * Add the current product to cart
   */
  async addToCart(): Promise<void> {
    logger.info('Adding product to cart');
    
    await tryWithErrorHandling(async () => {
      await this.addToCartButton.waitForVisible();
      await this.addToCartButton.click();
      
      // Wait for cart update confirmation
      await this.waitForCondition(
        async () => await this.page.locator(selectors.cartItemCount).isVisible(),
        { message: 'Waiting for cart to update', timeout: 5000 }
      );
    }, {
      errorMessage: 'Failed to add product to cart',
      retries: 1
    });
  }
  
  /**
   * Add a product to cart with size and quantity
   */
  async addItemToCart(productName: string, size: string, quantity: string): Promise<void> {
    logger.info(`Adding ${productName} to cart (size: ${size}, quantity: ${quantity})`);
    
    await tryWithErrorHandling(async () => {
      // Click on the product first
      await this.page.locator(`text="${productName}"`).first().click();
      await this.waitForPageLoad();
      
      // Select size and quantity
      await this.selectSize(size);
      await this.setQuantity(quantity);
      
      // Add to cart
      await this.addToCart();
    }, {
      errorMessage: `Failed to add ${productName} to cart`,
      retries: 1
    });
  }
  
  /**
   * View shopping cart
   */
  async viewCart(): Promise<void> {
    logger.info('Navigating to shopping cart');
    
    await tryWithErrorHandling(async () => {
      await this.cartButton.waitForVisible();
      await this.cartButton.click();
      await this.page.waitForURL(/.*\/cart$/);
    }, {
      errorMessage: 'Failed to navigate to shopping cart',
      retries: 1
    });
  }
  
  /**
   * Get product details from current page
   */
  async getProductDetails(): Promise<Partial<Product>> {
    return await tryWithErrorHandling(async () => {
      const name = await this.page.locator(selectors.productTitle).textContent() || '';
      const price = await this.page.locator(selectors.productPrice).textContent() || '';
      const description = await this.page.locator(selectors.productDescription).textContent() || '';
      
      // Get available sizes
      const sizesDropdown = this.sizeDropdown;
      const options = await sizesDropdown.getOptions();
      const sizes = options.map(option => option.text);
      
      return {
        name: name.trim(),
        price: price.trim(),
        description: description.trim(),
        sizes
      };
    }, {
      errorMessage: 'Failed to get product details',
      fallback: {}
    });
  }
}

/**
 * Factory function to create a ProductPage
 */
export function createProductPage(page: Page, url: string = ''): ProductPage {
  return new ProductPage(page, url);
}

export default ProductPage; 