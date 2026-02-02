import { webdriverio } from '@vitest/browser-webdriverio';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        bail: 1,
        browser: {
            enabled: true,
            instances: [
                // @ts-expect-error
                { browser: 'safari', name: 'Safari', provider: webdriverio({ capabilities: { 'webkit:alwaysAllowAutoplay': true } }) }
            ]
        },
        dir: 'test/expectation/safari/current/',
        include: ['**/*.js'],
        setupFiles: ['config/vitest/expectation-safari-current-setup.ts'],
        watch: false
    }
});
