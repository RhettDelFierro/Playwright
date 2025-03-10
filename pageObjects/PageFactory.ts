import { Page } from '@playwright/test';
import { SecurityPage } from './RoadToQA/SecurityPage';
import { ProductPage } from './RoadToQA/ProductPage';
import { CartPage } from './RoadToQA/CartPage';

/**
 * PageFactory creates instances of page objects.
 * This follows the Factory Method design pattern and implements
 * Ousterhout's principle of designing for the common case.
 */
export class PageFactory {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Get an instance of SecurityPage
   * @returns SecurityPage instance
   */
  getSecurityPage(): SecurityPage {
    return new SecurityPage(this.page);
  }

  /**
   * Get an instance of ProductPage
   * @returns ProductPage instance
   */
  getProductPage(): ProductPage {
    return new ProductPage(this.page);
  }

  /**
   * Get an instance of CartPage
   * @returns CartPage instance
   */
  getCartPage(): CartPage {
    return new CartPage(this.page);
  }
}

/**
 * Convenience function to create a PageFactory instance
 * @param page Playwright Page instance
 * @returns PageFactory instance
 */
export function createPageFactory(page: Page): PageFactory {
  return new PageFactory(page);
} 