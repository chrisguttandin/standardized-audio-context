import { webdriverio } from '@vitest/browser-webdriverio';
import { defineConfig } from 'vitest/config';

// eslint-disable-next-line import/no-default-export
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
                                args: ['--autoplay-policy=no-user-gesture-required', '--mute-audio'],
                                // eslint-disable-next-line max-len
                                binary: 'chrome-v148/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'
                            }
                        }
                    })
                }
            ]
        },
        dir: 'test/expectation/chrome/penultimate/',
        include: ['**/*.js'],
        watch: false
    }
});
