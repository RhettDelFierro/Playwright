import { test, expect } from '@playwright/test';
import { loginAndNavigateToDashboard, logout, configUrls } from '../../pageObjects/opensource/testSetup';

test.describe('Login and Logout Test', () => {
    test.beforeEach(async ({ page }) => {
        await loginAndNavigateToDashboard(page);
    });

    test('should login successfully', async ({ page }) => {
        await expect(page).toHaveURL(configUrls.dashboardPage);
    });

    test('should logout successfully', async ({ page }) => {
        await logout(page);
        await expect(page).toHaveURL(configUrls.loginPage);
    });
});
