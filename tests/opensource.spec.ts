import { test, expect, Page } from '@playwright/test';

test.describe('Login and Logout Test', () => {
    test('should login and logout successfully', async ({ page }) => {
        // Navigate to the login page
        await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

        // Wait for the username input and fill it
        await page.fill('[name="username"]', 'Admin');

        // Wait for the password input and fill it
        await page.fill('[name="password"]', 'admin123');

        // Click the login button
        await page.click('//button[@type="submit"]');

        // Wait for the profile picture to be clickable and click it
        await page.waitForSelector('//img[@alt="profile picture"]');
        await page.click('//img[@alt="profile picture"]');

        // Wait for the logout button to be visible and click it
        await page.waitForSelector('//a[@role="menuitem" and text()="Logout"]');
        await page.click('//a[@role="menuitem" and text()="Logout"]');

        // Verify that the login page is displayed again
        await expect(page).toHaveURL('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    });
});
