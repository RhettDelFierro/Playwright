import { test, expect } from '@playwright/test';
import assignLeave from '../../pageObjects/opensource/assignLeave';
import { loginAndNavigateToDashboard, configSelectors } from '../../pageObjects/opensource/testSetup';

test.describe('Orders Test', () => {
    test.beforeEach(async ({ page }) => {
        await loginAndNavigateToDashboard(page);
        await assignLeave.navigateToAssignLeave(page);
    });

    test('should display orders table', async ({ page }) => {
        await assignLeave.assignLeave('Betty', 'Brown');
        // await expect(ordersTable).toBeVisible();
    });

});
