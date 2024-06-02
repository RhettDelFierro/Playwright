import { Page } from '@playwright/test';
import { configSelectors } from '../../configurations/opensource/configAccessor';

const forgotPasswordPage = {
    async clickForgotPasswordLink(page: Page) {
        await page.click(configSelectors.forgotPasswordLink);
    },

    async clickCancelButton(page: Page) {
        await page.click(configSelectors.cancelButton);
    }
};

export default forgotPasswordPage;
