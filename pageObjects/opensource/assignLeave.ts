import {Page} from '@playwright/test'
import {configSelectors} from '../../configurations/opensource/configAccessor'

const assignLeave = {
    page: null,
    async navigateToAssignLeave(page: Page) {
        this.page = page
        await this.page.click(configSelectors.assignLeaveButton)
    },

    async assignLeave(firstName: string, lastName: string) {
        await this.page.waitForSelector(configSelectors.leaveTypeDropDown) // maybe wait for form instead.
        await this._fillLeaveForm(firstName, lastName)
    },

    async _fillLeaveForm(firstName: string, lastName: string) {
        await this._fillEmployeeName(firstName, lastName)
        await this._fillLeaveType()
        await this._fillDateRange()
        await this.page.click("//button[@type='submit' and text()=' Assign ']")

    },
    async _fillEmployeeName(firstName: string, lastName: string) {
        const employeeName = `${firstName} ${lastName}`
        await this.page.fill(configSelectors.leaveEmployeeNameInput, employeeName)
        const employeePicker = this.page.locator(`text=${employeeName}`)
        await employeePicker.click()
    },
    async _fillLeaveType() {
        const leaveTypeDropDown = this.page.locator(configSelectors.leaveTypeDropDown)
        await leaveTypeDropDown.click()
        const canOption = this.page.locator('text=CAN - Vacation')
        await canOption.click()
    },
    async _fillDateRange() {
        const fromDate = this._formatDate(new Date(Date.now() + 24 * 60 * 60 * 1000)); // Tomorrow
        const toDate = this._formatDate(new Date(Date.now() + 8 * 24 * 60 * 60 * 1000)); // Next week
        await this.page.fill(configSelectors.leaveFromDate, fromDate);
        await this.page.fill(configSelectors.leaveToDate, toDate);
    },
    _formatDate(date: Date): string {
        const yyyy = date.getFullYear();
        const dd = String(date.getDate()).padStart(2, '0');
        const MM = String(date.getMonth() + 1).padStart(2, '0');
        return `${yyyy}-${dd}-${MM}`;
    }
}

export default assignLeave
