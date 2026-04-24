import { webdriverio } from '@vitest/browser-webdriverio';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        bail: 1,
        browser: {
            enabled: true,
            instances: [
                {
                    browser: 'safari',
                    headless: false,
                    name: 'Safari',
                    // @ts-expect-error
                    provider: webdriverio({ capabilities: { 'webkit:alwaysAllowAutoplay': true } })
                }
            ]
        },
        dir: 'test/integration/',
        include: ['**/*.js'],
        watch: false
    }
});
