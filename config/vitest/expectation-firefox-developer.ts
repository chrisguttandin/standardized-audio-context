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
                    name: 'Firefox Developer',
                    provider: webdriverio({
                        capabilities: {
                            'moz:firefoxOptions': {
                                binary: '/Applications/Firefox\ Developer\ Edition.app/Contents/MacOS/firefox',
                                prefs: { 'media.autoplay.default': 0 }
                            }
                        }
                    })
                }
            ]
        },
        dir: 'test/expectation/firefox/developer/',
        include: ['**/*.js'],
        setupFiles: ['config/vitest/expectation-firefox-developer-setup.ts'],
        watch: false
    }
});
