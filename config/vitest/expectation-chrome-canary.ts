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
                    name: 'Chrome Canary',
                    provider: webdriverio({
                        capabilities: {
                            'goog:chromeOptions': {
                                args: ['--autoplay-policy=no-user-gesture-required'],
                                binary: '/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary'
                            }
                        }
                    })
                }
            ]
        },
        dir: 'test/expectation/chrome/canary/',
        include: ['**/*.js'],
        setupFiles: ['config/vitest/expectation-chrome-canary-setup.ts'],
        watch: false
    }
});
