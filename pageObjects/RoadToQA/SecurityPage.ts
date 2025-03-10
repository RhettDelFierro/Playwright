import { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

/**
 * SecurityPage handles authentication for password-protected pages.
 * This class demonstrates the principle of defining clear abstractions
 * and managing complexity by breaking functionality into focused modules.
 */
export class SecurityPage extends BasePage {
  private readonly passwordUrl = 'https://nectarine-pomegranate-rleh.squarespace.com/retest';
  private readonly passwordSelector = 'input[placeholder="Password"]';
  private readonly submitSelector = 'button[aria-label="Submit"]';

  /**
   * Enter password and submit the form to access protected content
   * @param password The password to enter
   */
  async enterPasswordAndSubmit(password: string = 'teziiqa2'): Promise<void> {
    await this.navigateTo(this.passwordUrl);
    await this.page.getByPlaceholder('Password').click();
    await this.page.getByPlaceholder('Password').fill(password);
    await this.page.getByLabel('Submit').click();
  }
} 