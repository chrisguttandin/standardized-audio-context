import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        bail: 1,
        browser: {
            enabled: true,
            instances: [
                {
                    browser: 'webkit',
                    headless: true,
                    name: 'Safari',
                    provider: playwright({ launchOptions: { executablePath: 'webkit-v18-0/pw_run.sh' } })
                }
            ]
        },
        dir: 'test/expectation/safari/penultimate/',
        include: ['**/*.js'],
        setupFiles: ['config/vitest/expectation-safari-penultimate-setup.ts'],
        watch: false
    }
});
