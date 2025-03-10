import { Page } from '@playwright/test';
import { MidsceneContext } from 'midscene';
import { BasePage } from './BasePage';

/**
 * SecurityPage handles authentication for password-protected pages using natural language.
 * This class demonstrates the principle of defining clear abstractions
 * and managing complexity by breaking functionality into focused modules.
 */
export class SecurityPage extends BasePage {
  private readonly passwordUrl = 'https://nectarine-pomegranate-rleh.squarespace.com/retest';

  /**
   * Enter password and submit the form to access protected content
   * @param password The password to enter
   */
  async enterPasswordAndSubmit(password: string = 'teziiqa2'): Promise<void> {
    await this.navigateTo(this.passwordUrl);
    await this.fillField('password field', password);
    await this.clickElement('the Submit button');
    
    // We can add a verification step using natural language
    await this.aiContext.assert(`Check that the password protected content is now visible`);
  }

  /**
   * Verify successful login
   */
  async verifySuccessfulLogin(): Promise<void> {
    await this.aiContext.assert(`Check that the user has successfully logged in`);
  }

  /**
   * Verify unsuccessful login
   */
  async verifyFailedLogin(): Promise<void> {
    await this.aiContext.assert(`Check that the user has failed to log in and an error message is displayed`);
  }
} 