import { test, expect } from '@playwright/test';
import loginPage from '../../pageObjects/opensource/loginPage';
import forgotPasswordPage from '../../pageObjects/opensource/forgotPasswordPage';
import { configUrls } from '../../pageObjects/opensource/testSetup';

test.describe('Forgot Password Test', () => {
    test.beforeEach(async ({ page }) => {
        await loginPage.navigate(page);
    });

    test('should interact with forgot password and cancel', async ({ page }) => {
        await forgotPasswordPage.clickForgotPasswordLink(page);
        await forgotPasswordPage.clickCancelButton(page);
        await expect(page).toHaveURL(configUrls.loginPage);
    });
});
