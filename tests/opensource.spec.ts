import { test, expect, Page } from '@playwright/test';

test.describe('Login and Logout Test', () => {
    test('should login and logout successfully', async ({ page }) => {
        // Navigate to the login page
        await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

        // Fill form
        await page.fill('[name="username"]', 'Admin');
        await page.fill('[name="password"]', 'admin123');

        // Click the login button
        await page.click('//button[@type="submit"]');

        // Wait for the profile picture to be clickable and click it
        await page.waitForSelector('//img[@alt="profile picture"]');
        await page.click('//img[@alt="profile picture"]');

        // Wait for the logout button to be visible and click it
        await page.waitForSelector('//a[@role="menuitem" and text()="Logout"]');
        await page.click('//a[@role="menuitem" and text()="Logout"]');

        // Interact with the Forgot Password link
        await page.waitForSelector('//p[@class="oxd-text oxd-text--p orangehrm-login-forgot-header"]');
        await page.click('//p[@class="oxd-text oxd-text--p orangehrm-login-forgot-header"]');

        // Interact with the Cancel button on the Forgot Password page
        await page.waitForSelector('//button[@type="button"]');
        await page.click('//button[@type="button"]');

        // Verify that the login page is displayed again
        const expectedUrl = 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';
        await expect(page).toHaveURL(expectedUrl);

        // Close the browser context
        await page.context().close();
    });
});
