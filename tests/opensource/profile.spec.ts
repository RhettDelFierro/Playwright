import { test, expect } from '@playwright/test';
import { loginAndNavigateToDashboard, navigateToProfile, updateProfile, getErrorMessage, logout, configUrls } from '../../pageObjects/opensource/testSetup';

test.describe('Profile Management', () => {
    test.beforeEach(async ({ page }) => {
        await loginAndNavigateToDashboard(page);
        await navigateToProfile(page);
    });

    test('should update profile successfully', async ({ page }) => {
        await updateProfile(page, 'Foo', 'Bar');
        // Add assertions to verify the profile update if necessary
    });

    test('should show error message for invalid input', async ({ page }) => {
        await updateProfile(page, '', 'Bar');
        const errorMessage = await getErrorMessage(page);
        await expect(errorMessage).toBe('Required');
    });

    test.afterEach(async ({ page }) => {
        await logout(page);
    });
});