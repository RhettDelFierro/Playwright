/**
 * Input UI Component
 * 
 * Encapsulates input field functionality and states
 * Following Ousterhout's principles of deep modules and clean abstraction
 */

import { Page } from '@playwright/test';
import UIComponent, { UIComponentOptions } from './UIComponent';
import { tryWithErrorHandling } from '../../utils/errors';
import { logger } from '../../utils/logger';

/**
 * Extended options for Input components
 */
export interface InputOptions extends UIComponentOptions {
  clearBeforeTyping?: boolean;
  autoValidate?: boolean;
  validateOnBlur?: boolean;
}

/**
 * Input component representing a text input field on the page
 */
export class Input extends UIComponent {
  private readonly clearBeforeTyping: boolean;
  private readonly autoValidate: boolean;
  private readonly validateOnBlur: boolean;
  
  /**
   * Create a new Input component
   */
  constructor(page: Page, baseSelector: string, options: InputOptions = {}) {
    super(page, baseSelector, { name: options.name || 'Input', ...options });
    this.clearBeforeTyping = options.clearBeforeTyping ?? true;
    this.autoValidate = options.autoValidate ?? false;
    this.validateOnBlur = options.validateOnBlur ?? false;
  }
  
  /**
   * Fill the input field with text
   */
  async fill(text: string): Promise<void> {
    logger.debug(`Filling input ${this.name} with text: ${text}`);
    
    await tryWithErrorHandling(async () => {
      await this.waitForVisible();
      
      if (this.clearBeforeTyping) {
        await this.clear();
      }
      
      await this.baseLocator.fill(text);
      
      if (this.validateOnBlur) {
        await this.blur();
      }
      
      if (this.autoValidate) {
        await this.validate();
      }
    }, {
      errorMessage: `Failed to fill input ${this.name} with text: ${text}`
    });
  }
  
  /**
   * Clear the input field
   */
  async clear(): Promise<void> {
    logger.debug(`Clearing input ${this.name}`);
    
    await tryWithErrorHandling(async () => {
      await this.waitForVisible();
      await this.baseLocator.clear();
    }, {
      errorMessage: `Failed to clear input ${this.name}`
    });
  }
  
  /**
   * Type text into the input field (character by character)
   */
  async type(text: string, options?: { delay?: number }): Promise<void> {
    const delay = options?.delay || 50;
    logger.debug(`Typing into input ${this.name} with text: ${text}`);
    
    await tryWithErrorHandling(async () => {
      await this.waitForVisible();
      
      if (this.clearBeforeTyping) {
        await this.clear();
      }
      
      await this.baseLocator.type(text, { delay });
      
      if (this.validateOnBlur) {
        await this.blur();
      }
      
      if (this.autoValidate) {
        await this.validate();
      }
    }, {
      errorMessage: `Failed to type into input ${this.name} with text: ${text}`
    });
  }
  
  /**
   * Check if the input field is editable
   */
  async isEditable(): Promise<boolean> {
    return await this.baseLocator.isEditable();
  }
  
  /**
   * Get the current value of the input field
   */
  async getValue(): Promise<string> {
    return await tryWithErrorHandling(async () => {
      return (await this.baseLocator.inputValue()).trim();
    }, {
      errorMessage: `Failed to get value of input ${this.name}`
    });
  }
  
  /**
   * Trigger blur event (move focus away from input)
   */
  async blur(): Promise<void> {
    logger.debug(`Blurring input ${this.name}`);
    
    await tryWithErrorHandling(async () => {
      await this.baseLocator.evaluate(el => (el as HTMLElement).blur());
    }, {
      errorMessage: `Failed to blur input ${this.name}`
    });
  }
  
  /**
   * Focus on the input field
   */
  async focus(): Promise<void> {
    logger.debug(`Focusing input ${this.name}`);
    
    await tryWithErrorHandling(async () => {
      await this.baseLocator.focus();
    }, {
      errorMessage: `Failed to focus input ${this.name}`
    });
  }
  
  /**
   * Check if the input field is valid (has no validation errors)
   */
  async isValid(): Promise<boolean> {
    return await tryWithErrorHandling(async () => {
      return await this.baseLocator.evaluate(el => (el as HTMLInputElement).validity.valid);
    }, {
      errorMessage: `Failed to check validity of input ${this.name}`,
      fallback: true
    });
  }
  
  /**
   * Validate the input field (useful for form validation)
   */
  async validate(): Promise<boolean> {
    logger.debug(`Validating input ${this.name}`);
    
    return await this.isValid();
  }
  
  /**
   * Press a key in the input field
   */
  async press(key: string): Promise<void> {
    logger.debug(`Pressing key ${key} in input ${this.name}`);
    
    await tryWithErrorHandling(async () => {
      await this.baseLocator.press(key);
    }, {
      errorMessage: `Failed to press key ${key} in input ${this.name}`
    });
  }
}

/**
 * Factory function to create an Input component
 */
export function createInput(
  page: Page, 
  selector: string, 
  options: InputOptions = {}
): Input {
  return new Input(page, selector, options);
}

export default Input; 