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
        // Calculate dates for 'From Date' and 'To Date'
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        const nextWeek = new Date()
        nextWeek.setDate(nextWeek.getDate() + 8)

        // Format dates to 'yyyy-dd-MM'
        const formatDate = (date: Date) => {
            const yyyy = date.getFullYear()
            const dd = String(date.getDate()).padStart(2, '0')
            const MM = String(date.getMonth() + 1).padStart(2, '0')
            return `${yyyy}-${dd}-${MM}`
        }

        const fromDate = formatDate(tomorrow)
        const toDate = formatDate(nextWeek)

        // Fill in the dates
        await this.page.fill(configSelectors.leaveFromDate, fromDate) // Replace with your actual selector
        await this.page.fill(configSelectors.leaveToDate, toDate) // Replace with your actual selector
    }
}

export default assignLeave
