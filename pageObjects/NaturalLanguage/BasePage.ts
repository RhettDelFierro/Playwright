import { Page } from '@playwright/test';
import { MidsceneContext } from 'midscene';

/**
 * BasePage for natural language testing using Midscene.js
 * Following the Philosophy of Software Design principles:
 * - Deep modules: Complex functionality with simple interfaces
 * - Information hiding: Implementation details hidden from consumers
 */
export class BasePage {
  protected page: Page;
  protected aiContext: MidsceneContext;

  constructor(page: Page, aiContext: MidsceneContext) {
    this.page = page;
    this.aiContext = aiContext;
  }

  /**
   * Navigate to a specific URL
   * @param url URL to navigate to
   */
  async navigateTo(url: string): Promise<void> {
    await this.aiContext.execute(`Navigate to ${url}`);
  }

  /**
   * Wait for the page to load
   */
  async waitForPageToLoad(): Promise<void> {
    await this.aiContext.execute(`Wait for the page to finish loading`);
  }

  /**
   * Take a screenshot for debugging or evidence
   * @param name Name of the screenshot file
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `${name}.png` });
  }

  /**
   * Fill a form field with text
   * @param fieldDescription Natural language description of the field
   * @param value Value to enter
   */
  async fillField(fieldDescription: string, value: string): Promise<void> {
    await this.aiContext.execute(`Fill in the ${fieldDescription} with "${value}"`);
  }

  /**
   * Click an element based on natural language description
   * @param elementDescription Natural language description of the element
   */
  async clickElement(elementDescription: string): Promise<void> {
    await this.aiContext.execute(`Click on ${elementDescription}`);
  }

  /**
   * Verify that an element exists
   * @param elementDescription Natural language description of the element
   */
  async verifyElementExists(elementDescription: string): Promise<void> {
    await this.aiContext.assert(`Check that ${elementDescription} is visible on the page`);
  }

  /**
   * Verify that an element does not exist
   * @param elementDescription Natural language description of the element
   */
  async verifyElementDoesNotExist(elementDescription: string): Promise<void> {
    await this.aiContext.assert(`Check that ${elementDescription} is not visible on the page`);
  }
} 