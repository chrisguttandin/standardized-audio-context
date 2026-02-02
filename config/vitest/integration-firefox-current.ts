import { env } from 'node:process';
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
                    headless: env.CI !== 'true',
                    name: 'Firefox',
                    provider: webdriverio({
                        capabilities: {
                            'moz:firefoxOptions': {
                                prefs: {
                                    'media.autoplay.default': 0,
                                    'media.navigator.permission.disabled': true,
                                    'media.navigator.streams.fake': true
                                }
                            }
                        }
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
