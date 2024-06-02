import { Page } from '@playwright/test';
import loginPage from './loginPage';
import dashboardPage from './dashboardPage';
import profilePage from './profilePage';
import config from '../../configurations/opensource/config';
import { configSelectors, configUrls } from '../../configurations/opensource/configAccessor';

export async function loginAndNavigateToDashboard(page: Page) {
    await loginPage.navigate(page);
    await loginPage.login(page, config.login.username, config.login.password);
}

export async function logout(page: Page) {
    await dashboardPage.logout(page);
}

export async function navigateToProfile(page: Page) {
    await profilePage.navigateToProfile(page);
}

export async function updateProfile(page: Page, firstName: string, lastName: string) {
    await profilePage.updateProfile(page, firstName, lastName);
}

export async function getErrorMessage(page: Page) {
    return await profilePage.getErrorMessage(page);
}

export { configUrls, configSelectors };
