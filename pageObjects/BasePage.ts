import { Page } from '@playwright/test';

/**
 * BasePage provides common functionality for all page objects.
 * Following the Philosophy of Software Design principles:
 * - Deep modules: Complex functionality with simple interfaces
 * - Information hiding: Implementation details hidden from consumers
 */
export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a specific URL
   * @param url URL to navigate to
   */
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Wait for navigation to complete after an action
   * @param url Expected URL after navigation
   */
  async waitForNavigation(url: string): Promise<void> {
    await this.page.waitForURL(url);
  }

  /**
   * Take a screenshot for debugging or evidence
   * @param name Name of the screenshot file
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `${name}.png` });
  }

  /**
   * Fill an input field with the specified text
   * @param selector Selector for the input element
   * @param text Text to enter into the field
   */
  async fillField(selector: string, text: string): Promise<void> {
    await this.page.fill(selector, text);
  }

  /**
   * Click on an element
   * @param selector Selector for the element to click
   */
  async clickElement(selector: string): Promise<void> {
    await this.page.click(selector);
  }
} 