import { webdriverio } from '@vitest/browser-webdriverio';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        bail: 1,
        browser: {
            enabled: true,
            instances: [
                {
                    browser: 'firefox',
                    headless: true,
                    name: 'Firefox',
                    provider: webdriverio({
                        capabilities: {
                            'moz:firefoxOptions': {
                                binary: 'firefox-v144/firefox/Firefox.app/Contents/MacOS/firefox',
                                prefs: { 'media.autoplay.default': 0 }
                            }
                        }
                    })
                }
            ]
        },
        dir: 'test/expectation/firefox/penultimate/',
        include: ['**/*.js'],
        setupFiles: ['config/vitest/expectation-firefox-penultimate-setup.ts'],
        watch: false
    }
});
