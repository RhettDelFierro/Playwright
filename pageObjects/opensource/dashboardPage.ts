import { Page } from '@playwright/test';
import { configUrls, configSelectors } from '../../configurations/opensource/configAccessor';

const dashboardPage = {
    async navigateToDashboard(page: Page) {
        await page.goto(configUrls.dashboardPage);
    },

    async logout(page: Page) {
        await page.click(configSelectors.profilePicture);
        await page.click(configSelectors.logoutButton);
    }
};

export default dashboardPage;
