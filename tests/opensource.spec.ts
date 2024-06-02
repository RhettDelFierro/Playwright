import { test, expect, Page } from '@playwright/test';

async function login(page: Page, username: string, password: string) {
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    await page.fill('[name="username"]', username);
    await page.fill('[name="password"]', password);
    await page.click('//button[@type="submit"]');
}

async function logout(page: Page) {
    await page.waitForSelector('//img[@alt="profile picture"]');
    await page.click('//img[@alt="profile picture"]');
    await page.waitForSelector('//a[@role="menuitem" and text()="Logout"]');
    await page.click('//a[@role="menuitem" and text()="Logout"]');
}

async function interactWithForgotPassword(page: Page) {
    await page.waitForSelector('//p[@class="oxd-text oxd-text--p orangehrm-login-forgot-header"]');
    await page.click('//p[@class="oxd-text oxd-text--p orangehrm-login-forgot-header"]');
}

async function cancelForgotPassword(page: Page) {
    await page.waitForSelector('//button[@type="button"]');
    await page.click('//button[@type="button"]');
}

test.describe('Login and Logout Test', () => {
    test('should login and logout successfully', async ({ page }) => {
        await login(page, 'Admin', 'admin123');
        await logout(page);

        // Verify that the login page is displayed again
        const expectedUrl = 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';
        await expect(page).toHaveURL(expectedUrl);
    });

    test('should interact with forgot password and cancel', async ({ page }) => {
        await login(page, 'Admin', 'admin123');
        await interactWithForgotPassword(page);
        await cancelForgotPassword(page);

        // Verify that the login page is displayed again
        const expectedUrl = 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';
        await expect(page).toHaveURL(expectedUrl);
    });
});
