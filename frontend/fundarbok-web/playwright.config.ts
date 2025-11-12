import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 1 : 1,
  reporter: [
    ['html', { outputFolder: 'test-results/html' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list'],
  ],
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  // Servers already running, don't start them
  // webServer: [
  //   {
  //     command: 'npm run start',
  //     url: 'http://localhost:4200',
  //     reuseExistingServer: !process.env['CI'],
  //     timeout: 120 * 1000,
  //   },
  //   {
  //     command: 'cd ../../backend/Fundarbok.API && dotnet run',
  //     url: 'http://localhost:5255/api/health',
  //     reuseExistingServer: !process.env['CI'],
  //     timeout: 120 * 1000,
  //   },
  // ],

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
