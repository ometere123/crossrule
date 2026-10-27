import {defineConfig,devices} from '@playwright/test';
const baseURL=process.env.PLAYWRIGHT_BASE_URL??'http://127.0.0.1:3000';
export default defineConfig({
  testDir:'./tests/e2e',timeout:30000,retries:process.env.CI?2:0,
  use:{baseURL,trace:'retain-on-failure'},
  projects:[{name:'chromium',use:{...devices['Desktop Chrome']}},{name:'mobile-chromium',use:{...devices['Pixel 7']}}],
  webServer:process.env.PLAYWRIGHT_BASE_URL?undefined:{command:'npm run dev -- --hostname 127.0.0.1',url:'http://127.0.0.1:3000',reuseExistingServer:!process.env.CI,timeout:120000}
});
