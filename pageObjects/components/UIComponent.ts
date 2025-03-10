/**
 * UI Component System
 * 
 * A compositional approach to page objects following Ousterhout's principles:
 * - Deep modules: Complex UI handling with simple interfaces
 * - Simplicity through composition rather than inheritance
 * - Better abstractions through component composition
 */

import { Page, Locator } from '@playwright/test';
import { tryWithErrorHandling } from '../../utils/errors';
import { logger } from '../../utils/logger';

/**
 * Base interface for UI component options
 */
export interface UIComponentOptions {
  name?: string;
  parent?: UIComponent;
  timeout?: number;
}

/**
 * Base UI component class
 */
export class UIComponent {
  protected page: Page;
  protected baseLocator: Locator;
  protected name: string;
  protected parent?: UIComponent;
  protected timeout: number;
  protected children: UIComponent[] = [];

  /**
   * Create a new UI component
   * 
   * @param page Playwright page object
   * @param baseSelector Base selector for this component
   * @param options Additional component options
   */
  constructor(page: Page, baseSelector: string, options: UIComponentOptions = {}) {
    this.page = page;
    this.baseLocator = page.locator(baseSelector);
    this.name = options.name || this.constructor.name;
    this.parent = options.parent;
    this.timeout = options.timeout || 30000;
    
    // Register with parent if provided
    if (this.parent) {
      this.parent.addChild(this);
    }
  }

  /**
   * Add a child component
   */
  protected addChild(component: UIComponent): void {
    this.children.push(component);
  }

  /**
   * Wait for this component to be visible
   */
  async waitForVisible(timeout?: number): Promise<void> {
    const actualTimeout = timeout || this.timeout;
    logger.debug(`Waiting for ${this.name} to be visible`, { timeout: actualTimeout });
    
    await tryWithErrorHandling(
      async () => await this.baseLocator.waitFor({ state: 'visible', timeout: actualTimeout }),
      { errorMessage: `Timeout waiting for ${this.name} to be visible` }
    );
  }

  /**
   * Check if the component is visible
   */
  async isVisible(): Promise<boolean> {
    return await this.baseLocator.isVisible();
  }

  /**
   * Wait for the component to be hidden
   */
  async waitForHidden(timeout?: number): Promise<void> {
    const actualTimeout = timeout || this.timeout;
    logger.debug(`Waiting for ${this.name} to be hidden`, { timeout: actualTimeout });
    
    await tryWithErrorHandling(
      async () => await this.baseLocator.waitFor({ state: 'hidden', timeout: actualTimeout }),
      { errorMessage: `Timeout waiting for ${this.name} to be hidden` }
    );
  }
  
  /**
   * Get text content of this component
   */
  async getText(): Promise<string> {
    return await this.baseLocator.textContent() || '';
  }
  
  /**
   * Click on this component
   */
  async click(): Promise<void> {
    logger.debug(`Clicking on ${this.name}`);
    await tryWithErrorHandling(
      async () => await this.baseLocator.click(),
      { errorMessage: `Failed to click on ${this.name}` }
    );
  }
  
  /**
   * Hover over this component
   */
  async hover(): Promise<void> {
    logger.debug(`Hovering over ${this.name}`);
    await tryWithErrorHandling(
      async () => await this.baseLocator.hover(),
      { errorMessage: `Failed to hover over ${this.name}` }
    );
  }
  
  /**
   * Get all child components
   */
  getChildren(): UIComponent[] {
    return [...this.children];
  }
  
  /**
   * Take a screenshot of this component
   */
  async screenshot(name?: string): Promise<Buffer> {
    const screenshotName = name || `${this.name}-screenshot`;
    logger.debug(`Taking screenshot of ${this.name}`);
    
    return await tryWithErrorHandling(
      async () => await this.baseLocator.screenshot(),
      { errorMessage: `Failed to take screenshot of ${this.name}` }
    );
  }
  
  /**
   * Get the count of matching elements
   */
  async count(): Promise<number> {
    return await this.baseLocator.count();
  }
  
  /**
   * Get Playwright locator for this component
   */
  getLocator(): Locator {
    return this.baseLocator;
  }
}

/**
 * Create a typed UI component with chainable methods
 */
export function createComponent<T extends UIComponent>(
  componentType: new (page: Page, baseSelector: string, options: UIComponentOptions) => T,
  page: Page,
  baseSelector: string,
  options: UIComponentOptions = {}
): T {
  return new componentType(page, baseSelector, options);
}

export default UIComponent; 