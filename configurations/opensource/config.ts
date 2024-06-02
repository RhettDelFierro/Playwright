const fs = require('fs');
const path = require('path');

interface Config {
    login: {
        username: string;
        password: string;
    };
    leave: {
        employee1: string;
    };
    urls: {
        loginPage: string;
        dashboardPage: string;
        profilePage: string;
    };
    selectors: {
        profilePicture: string;
        logoutButton: string;
        usernameInput: string;
        passwordInput: string;
        loginButton: string;
        forgotPasswordLink: string;
        cancelButton: string;
        assignLeaveButton: string;
        leaveTypeDropDown: string;
        leaveEmployeeNameInput: string;
        leaveFromDate: string;
        leaveToDate: string;
        firstNameInput: string;
        lastNameInput: string;
        saveButton: string;
        errorMessage: string;
    };
}

const configPath = path.join(__dirname, 'config.json');
const rawConfig = fs.readFileSync(configPath, 'utf-8');
const config: Config = JSON.parse(rawConfig);

export { Config };
export default config;
