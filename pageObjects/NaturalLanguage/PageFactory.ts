import { Page } from '@playwright/test';
import { MidsceneContext } from 'midscene';
import { SecurityPage } from './SecurityPage';
import { ProductPage } from './ProductPage';
import { CartPage } from './CartPage';

/**
 * PageFactory creates instances of page objects for natural language testing.
 * This follows the Factory Method design pattern and implements
 * Ousterhout's principle of designing for the common case.
 */
export class PageFactory {
  private page: Page;
  private aiContext: MidsceneContext;

  constructor(page: Page, aiContext: MidsceneContext) {
    this.page = page;
    this.aiContext = aiContext;
  }

  /**
   * Get an instance of SecurityPage
   * @returns SecurityPage instance
   */
  getSecurityPage(): SecurityPage {
    return new SecurityPage(this.page, this.aiContext);
  }

  /**
   * Get an instance of ProductPage
   * @returns ProductPage instance
   */
  getProductPage(): ProductPage {
    return new ProductPage(this.page, this.aiContext);
  }

  /**
   * Get an instance of CartPage
   * @returns CartPage instance
   */
  getCartPage(): CartPage {
    return new CartPage(this.page, this.aiContext);
  }
}

/**
 * Convenience function to create a PageFactory instance
 * @param page Playwright Page instance
 * @param aiContext Midscene AI context
 * @returns PageFactory instance
 */
export function createPageFactory(page: Page, aiContext: MidsceneContext): PageFactory {
  return new PageFactory(page, aiContext);
} 