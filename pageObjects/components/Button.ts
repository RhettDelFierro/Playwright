/**
 * Button UI Component
 * 
 * Encapsulates button functionality and states
 * Following Ousterhout's principles of deep modules and clean abstraction
 */

import { Page } from '@playwright/test';
import UIComponent, { UIComponentOptions } from './UIComponent';
import { tryWithErrorHandling } from '../../utils/errors';
import { logger } from '../../utils/logger';

/**
 * Extended options for Button components
 */
export interface ButtonOptions extends UIComponentOptions {
  waitForEnabled?: boolean;
}

/**
 * Button component representing a clickable button on the page
 */
export class Button extends UIComponent {
  private readonly waitForEnabled: boolean;
  
  /**
   * Create a new Button component
   */
  constructor(page: Page, baseSelector: string, options: ButtonOptions = {}) {
    super(page, baseSelector, { name: options.name || 'Button', ...options });
    this.waitForEnabled = options.waitForEnabled ?? true;
  }
  
  /**
   * Check if button is enabled
   */
  async isEnabled(): Promise<boolean> {
    return await this.baseLocator.isEnabled();
  }
  
  /**
   * Click the button with automatic waiting for enabled state if configured
   */
  async click(): Promise<void> {
    logger.debug(`Clicking button: ${this.name}`);
    
    if (this.waitForEnabled) {
      await tryWithErrorHandling(
        async () => {
          await this.baseLocator.waitFor({ state: 'visible' });
          await this.baseLocator.waitFor({ state: 'enabled' });
        },
        { errorMessage: `Button not clickable: ${this.name}` }
      );
    }
    
    await super.click();
  }
  
  /**
   * Wait for button to be enabled
   */
  async waitForEnabled(timeout?: number): Promise<void> {
    const actualTimeout = timeout || this.timeout;
    logger.debug(`Waiting for button to be enabled: ${this.name}`);
    
    await tryWithErrorHandling(
      async () => await this.baseLocator.waitFor({ state: 'enabled', timeout: actualTimeout }),
      { errorMessage: `Timeout waiting for button to be enabled: ${this.name}` }
    );
  }
  
  /**
   * Get button text
   */
  async getText(): Promise<string> {
    return (await super.getText()).trim();
  }
}

/**
 * Factory function to create a Button component
 */
export function createButton(
  page: Page, 
  selector: string, 
  options: ButtonOptions = {}
): Button {
  return new Button(page, selector, options);
}

export default Button; 