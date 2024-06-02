import { Page } from '@playwright/test';
import { configUrls, configSelectors } from '../../configurations/opensource/configAccessor';

const profilePage = {
    async navigateToProfile(page: Page) {
        await page.goto(configUrls.profilePage);
    },

    async updateProfile(page: Page, firstName: string, lastName: string) {
        await page.fill(configSelectors.firstNameInput, firstName);
        await page.fill(configSelectors.lastNameInput, lastName);
        await page.click(configSelectors.saveButton);
    },

    async getErrorMessage(page: Page) {
        return await page.textContent(configSelectors.errorMessage);
    }
};

export default profilePage;
