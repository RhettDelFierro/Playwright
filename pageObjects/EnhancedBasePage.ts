/**
 * Enhanced Base Page Object
 * 
 * Follows Ousterhout's principles by:
 * - Using component composition for cleaner abstractions
 * - Making interfaces deep and simple
 * - Encapsulating complexity in modular components
 */

import { Page } from '@playwright/test';
import { tryWithErrorHandling } from '../utils/errors';
import { logger } from '../utils/logger';
import config from '../configurations/config';
import UIComponent from './components/UIComponent';
import Button from './components/Button';
import Input from './components/Input';
import Dropdown from './components/Dropdown';

/**
 * Page component model for cleaner organization
 */
export interface PageComponent {
  name: string;
  component: UIComponent;
}

/**
 * Enhanced BasePage that uses component composition
 */
export class EnhancedBasePage {
  protected page: Page;
  protected url: string;
  protected components: Map<string, UIComponent> = new Map();
  protected pageTitle: string;
  protected pageLoadTimeout: number;
  
  /**
   * Create a new EnhancedBasePage
   */
  constructor(page: Page, url: string = '', pageTitle: string = '') {
    this.page = page;
    this.url = url || config.baseUrl;
    this.pageTitle = pageTitle;
    this.pageLoadTimeout = config.timeouts.navigationTimeout;
    
    this.initializeComponents();
  }
  
  /**
   * Initialize page components - to be overridden by subclasses
   */
  protected initializeComponents(): void {
    // Implement in subclasses to initialize components
  }
  
  /**
   * Register a component with the page
   */
  protected registerComponent(name: string, component: UIComponent): UIComponent {
    this.components.set(name, component);
    return component;
  }
  
  /**
   * Create and register a button component
   */
  protected createButton(name: string, selector: string): Button {
    const button = new Button(this.page, selector, { name });
    this.registerComponent(name, button);
    return button;
  }
  
  /**
   * Create and register an input component
   */
  protected createInput(name: string, selector: string): Input {
    const input = new Input(this.page, selector, { name });
    this.registerComponent(name, input);
    return input;
  }
  
  /**
   * Create and register a dropdown component
   */
  protected createDropdown(name: string, selector: string): Dropdown {
    const dropdown = new Dropdown(this.page, selector, { name });
    this.registerComponent(name, dropdown);
    return dropdown;
  }
  
  /**
   * Get a component by name
   */
  protected getComponent<T extends UIComponent>(name: string): T {
    const component = this.components.get(name);
    if (!component) {
      throw new Error(`Component "${name}" not found on page ${this.pageTitle}`);
    }
    return component as T;
  }
  
  /**
   * Navigate to the page
   */
  async navigateTo(url: string = ''): Promise<void> {
    const targetUrl = url || this.url;
    logger.info(`Navigating to ${targetUrl}`);
    
    await tryWithErrorHandling(
      async () => await this.page.goto(targetUrl, { timeout: this.pageLoadTimeout }),
      { errorMessage: `Failed to navigate to ${targetUrl}` }
    );
    
    await this.waitForPageLoad();
  }
  
  /**
   * Wait for the page to be fully loaded
   */
  async waitForPageLoad(): Promise<void> {
    logger.debug(`Waiting for ${this.pageTitle || 'page'} to load`);
    
    await tryWithErrorHandling(async () => {
      // Wait for network to be idle
      await this.page.waitForLoadState('networkidle', { timeout: this.pageLoadTimeout });
      
      // Wait for no visible loading indicators if needed
      // This can be extended in subclasses
    }, {
      errorMessage: `Timeout waiting for ${this.pageTitle || 'page'} to load`
    });
  }
  
  /**
   * Get the page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }
  
  /**
   * Take a screenshot for debugging or evidence
   */
  async takeScreenshot(name: string): Promise<void> {
    const screenshotPath = `${config.screenshots.directory}/${name}.png`;
    logger.debug(`Taking screenshot: ${screenshotPath}`);
    
    await tryWithErrorHandling(
      async () => await this.page.screenshot({ path: screenshotPath }),
      { errorMessage: `Failed to take screenshot: ${screenshotPath}` }
    );
  }
  
  /**
   * Get the current URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }
  
  /**
   * Check if the page is currently loaded/active
   */
  async isCurrentPage(): Promise<boolean> {
    if (!this.pageTitle) return true;
    
    const title = await this.getTitle();
    return title.includes(this.pageTitle);
  }
  
  /**
   * Reload the page
   */
  async reload(): Promise<void> {
    logger.info(`Reloading page: ${this.pageTitle || this.url}`);
    
    await tryWithErrorHandling(
      async () => await this.page.reload({ timeout: this.pageLoadTimeout }),
      { errorMessage: `Failed to reload page: ${this.pageTitle || this.url}` }
    );
    
    await this.waitForPageLoad();
  }
  
  /**
   * Wait for a condition to be true
   */
  async waitForCondition<T>(
    condition: () => Promise<T>,
    options: {
      timeout?: number;
      message?: string;
      checkInterval?: number;
    } = {}
  ): Promise<T> {
    const { 
      timeout = this.pageLoadTimeout, 
      message = 'Waiting for condition',
      checkInterval = 100
    } = options;
    
    logger.debug(message, { timeout });
    
    const startTime = Date.now();
    let lastError: Error | null = null;
    
    while (Date.now() - startTime < timeout) {
      try {
        return await condition();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        await this.page.waitForTimeout(checkInterval);
      }
    }
    
    throw new Error(`Timeout: ${message} (${timeout}ms) - ${lastError?.message || ''}`);
  }
}

export default EnhancedBasePage; 