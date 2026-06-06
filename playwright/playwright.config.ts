import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  testDir: './e2e/tests',

  // Run each spec file in its own worker; set to false to serialize
  fullyParallel: true,

  // Emit an HTML report viewable with `npx playwright show-report`
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:5173',

    // Save a trace zip on the first retry so failures are debuggable
    trace: 'on-first-retry',
  },

  // Spin up the Vite dev server before the suite; skip if one is already running
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
    // Config lives in playwright/ so point cwd at the project root where package.json is
    cwd: path.resolve(__dirname, '..'),
  },

  projects: [
    // --- Active ---
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // --- Uncomment to enable cross-browser and mobile coverage ---
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
    // {
    //   name: 'Mobile Chrome (Pixel 5)',
    //   use: { ...devices['Pixel 5'] },
    // },
  ],
});
