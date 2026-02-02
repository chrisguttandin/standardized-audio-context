import { webdriverio } from '@vitest/browser-webdriverio';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        bail: 1,
        browser: {
            enabled: true,
            instances: [
                {
                    browser: 'chrome',
                    headless: true,
                    name: 'Chrome',
                    provider: webdriverio({
                        capabilities: { 'goog:chromeOptions': { args: ['--autoplay-policy=no-user-gesture-required'] } }
                    })
                }
            ]
        },
        dir: 'test/expectation/chrome/current/',
        include: ['**/*.js'],
        setupFiles: ['config/vitest/expectation-chrome-current-setup.ts'],
        watch: false
    }
});
