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
                        capabilities: { 'goog:chromeOptions': { args: ['--autoplay-policy=no-user-gesture-required', '--mute-audio'] } }
                    })
                }
            ]
        },
        dir: 'test/integration/',
        include: ['**/*.js'],
        setupFiles: ['config/vitest/integration-setup.ts'],
        watch: false
    }
});
