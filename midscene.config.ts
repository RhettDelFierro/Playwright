import { defineConfig } from '@playwright/test';
import { devices } from '@playwright/test';

/**
 * Midscene.js configuration file that extends Playwright config
 * and sets up Midscene.js with natural language support
 * Following Ousterhout's Philosophy of Software Design principles
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: false, // Natural language tests work better sequentially
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Natural language tests work better with a single worker
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
    headless: false, // Midscene works better with headed browsers
    // Midscene.js requires longer timeouts for AI processing
    navigationTimeout: 60000,
    actionTimeout: 60000,
    // Setting up Midscene
    midscene: {
      enabled: true,
      model: process.env.MIDSCENE_MODEL || 'UI-TARS', // Use open-source UI-TARS model by default
      apiKey: process.env.OPENAI_API_KEY || process.env.MIDSCENE_API_KEY,
      screenshotOnFailure: true,
      detailedReports: true,
      logLevel: 'info'
    }
  },
  
  // Configure projects for browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    }
  ],
}); 