/**
 * Dropdown UI Component
 * 
 * Encapsulates dropdown/select functionality and states
 * Following Ousterhout's principles of deep modules and clean abstraction
 */

import { Page } from '@playwright/test';
import UIComponent, { UIComponentOptions } from './UIComponent';
import { tryWithErrorHandling } from '../../utils/errors';
import { logger } from '../../utils/logger';

/**
 * Extended options for Dropdown components
 */
export interface DropdownOptions extends UIComponentOptions {
  optionSelector?: string;
  validateSelection?: boolean;
}

/**
 * Option interface representing a dropdown option
 */
export interface DropdownOption {
  text: string;
  value: string;
  isSelected: boolean;
}

/**
 * Dropdown component representing a select element on the page
 */
export class Dropdown extends UIComponent {
  private readonly optionSelector: string;
  private readonly validateSelection: boolean;
  
  /**
   * Create a new Dropdown component
   */
  constructor(page: Page, baseSelector: string, options: DropdownOptions = {}) {
    super(page, baseSelector, { name: options.name || 'Dropdown', ...options });
    this.optionSelector = options.optionSelector || 'option';
    this.validateSelection = options.validateSelection ?? true;
  }
  
  /**
   * Select an option by value
   */
  async selectByValue(value: string): Promise<void> {
    logger.debug(`Selecting option with value "${value}" in dropdown ${this.name}`);
    
    await tryWithErrorHandling(async () => {
      await this.waitForVisible();
      await this.baseLocator.selectOption({ value });
      
      if (this.validateSelection) {
        await this.validateOptionSelected(value);
      }
    }, {
      errorMessage: `Failed to select option with value "${value}" in dropdown ${this.name}`
    });
  }
  
  /**
   * Select an option by visible text
   */
  async selectByText(text: string): Promise<void> {
    logger.debug(`Selecting option with text "${text}" in dropdown ${this.name}`);
    
    await tryWithErrorHandling(async () => {
      await this.waitForVisible();
      await this.baseLocator.selectOption({ label: text });
      
      if (this.validateSelection) {
        const options = await this.getOptions();
        const selectedOption = options.find(option => option.isSelected);
        
        if (!selectedOption || selectedOption.text !== text) {
          throw new Error(`Failed to validate selection of "${text}" in dropdown ${this.name}`);
        }
      }
    }, {
      errorMessage: `Failed to select option with text "${text}" in dropdown ${this.name}`
    });
  }
  
  /**
   * Select an option by index
   */
  async selectByIndex(index: number): Promise<void> {
    logger.debug(`Selecting option at index ${index} in dropdown ${this.name}`);
    
    await tryWithErrorHandling(async () => {
      await this.waitForVisible();
      await this.baseLocator.selectOption({ index });
      
      if (this.validateSelection) {
        const options = await this.getOptions();
        if (!options[index] || !options[index].isSelected) {
          throw new Error(`Failed to validate selection at index ${index} in dropdown ${this.name}`);
        }
      }
    }, {
      errorMessage: `Failed to select option at index ${index} in dropdown ${this.name}`
    });
  }
  
  /**
   * Get all available options
   */
  async getOptions(): Promise<DropdownOption[]> {
    return await tryWithErrorHandling(async () => {
      const optionElements = this.baseLocator.locator(this.optionSelector);
      const count = await optionElements.count();
      const options: DropdownOption[] = [];
      
      for (let i = 0; i < count; i++) {
        const optionElement = optionElements.nth(i);
        const text = await optionElement.textContent() || '';
        const value = await optionElement.getAttribute('value') || '';
        const isSelected = await optionElement.isSelected();
        
        options.push({ text: text.trim(), value, isSelected });
      }
      
      return options;
    }, {
      errorMessage: `Failed to get options for dropdown ${this.name}`,
      fallback: []
    });
  }
  
  /**
   * Get the currently selected option
   */
  async getSelectedOption(): Promise<DropdownOption | null> {
    return await tryWithErrorHandling(async () => {
      const options = await this.getOptions();
      return options.find(option => option.isSelected) || null;
    }, {
      errorMessage: `Failed to get selected option for dropdown ${this.name}`,
      fallback: null
    });
  }
  
  /**
   * Get the selected value
   */
  async getSelectedValue(): Promise<string> {
    const option = await this.getSelectedOption();
    return option ? option.value : '';
  }
  
  /**
   * Get the selected text
   */
  async getSelectedText(): Promise<string> {
    const option = await this.getSelectedOption();
    return option ? option.text : '';
  }
  
  /**
   * Check if a specific option exists in the dropdown
   */
  async hasOption(textOrValue: string): Promise<boolean> {
    const options = await this.getOptions();
    return options.some(option => 
      option.text === textOrValue || option.value === textOrValue
    );
  }
  
  /**
   * Validate that an option with specified value is selected
   */
  private async validateOptionSelected(value: string): Promise<void> {
    const selectedValue = await this.getSelectedValue();
    
    if (selectedValue !== value) {
      throw new Error(`Expected option with value "${value}" to be selected, but "${selectedValue}" was selected instead`);
    }
  }
}

/**
 * Factory function to create a Dropdown component
 */
export function createDropdown(
  page: Page, 
  selector: string, 
  options: DropdownOptions = {}
): Dropdown {
  return new Dropdown(page, selector, options);
}

export default Dropdown; 