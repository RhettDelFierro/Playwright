import { Page } from '@playwright/test';
import { configUrls, configSelectors } from '../../configurations/opensource/configAccessor';

const loginPage = {
    async navigate(page: Page) {
        await page.goto(configUrls.loginPage);
    },

    async login(page: Page, username: string, password: string) {
        await page.fill(configSelectors.username, username);
        await page.fill(configSelectors.password, password);
        await page.click(configSelectors.loginButton);
    },

    async clickForgotPassword(page: Page) {
        await page.click(configSelectors.forgotPasswordLink);
    },

    async cancelForgotPassword(page: Page) {
        await page.click(configSelectors.cancelButton);
    }
};

export default loginPage;
