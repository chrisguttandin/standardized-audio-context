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
                        capabilities: {
                            'goog:chromeOptions': {
                                args: ['--autoplay-policy=no-user-gesture-required'],
                                binary: 'chromium-v142/chrome-mac/Chromium.app/Contents/MacOS/Chromium'
                            }
                        }
                    })
                }
            ]
        },
        dir: 'test/expectation/chrome/previous/',
        include: ['**/*.js'],
        setupFiles: ['config/vitest/expectation-chrome-previous-setup.ts'],
        watch: false
    }
});
