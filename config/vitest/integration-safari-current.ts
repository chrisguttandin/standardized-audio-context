import { env } from 'node:process';
import { webdriverio } from '@vitest/browser-webdriverio';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        bail: 1,
        browser: {
            enabled: true,
            instances: env.CI
                ? []
                : // @ts-expect-error
                  [{ browser: 'safari', name: 'Safari', provider: webdriverio({ capabilities: { 'webkit:alwaysAllowAutoplay': true } }) }]
        },
        dir: 'test/integration/',
        include: ['**/*.js'],
        setupFiles: ['config/vitest/integration-setup.ts'],
        watch: false
    }
});
