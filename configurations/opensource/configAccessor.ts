import config from './config';

export const configUrls = {
    loginPage: config.urls.loginPage,
    dashboardPage: config.urls.dashboardPage,
    profilePage: config.urls.profilePage
};

export const configSelectors = {
    username: config.selectors.usernameInput,
    password: config.selectors.passwordInput,
    loginButton: config.selectors.loginButton,
    profilePicture: config.selectors.profilePicture,
    logoutButton: config.selectors.logoutButton,
    forgotPasswordLink: config.selectors.forgotPasswordLink,
    cancelButton: config.selectors.cancelButton,
    assignLeaveButton: config.selectors.assignLeaveButton,
    leaveEmployeeNameInput: config.selectors.leaveEmployeeNameInput,
    leaveTypeDropDown: config.selectors.leaveTypeDropDown,
    leaveFromDate: config.selectors.leaveFromDate,
    leaveToDate: config.selectors.leaveToDate,
    firstNameInput: config.selectors.firstNameInput,
    lastNameInput: config.selectors.lastNameInput,
    saveButton: config.selectors.saveButton,
    errorMessage: config.selectors.errorMessage
};
