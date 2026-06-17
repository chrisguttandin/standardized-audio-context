import config from 'eslint-config-holy-grail';
import { defineConfig } from 'eslint/config';
import globals from 'globals';

// eslint-disable-next-line import/no-default-export
export default defineConfig([
    { extends: [config], languageOptions: { globals: { ...globals.node } }, rules: { 'no-sync': 'off', 'node/no-missing-require': 'off' } },
    {
        files: ['**/*.ts'],
        languageOptions: {
            parserOptions: {
                projectService: {
                    allowDefaultProject: [
                        'config/vitest/expectation-chrome-canary.ts',
                        'config/vitest/expectation-chrome-current.ts',
                        'config/vitest/expectation-chrome-penultimate.ts',
                        'config/vitest/expectation-chrome-previous.ts',
                        'config/vitest/expectation-firefox-current.ts',
                        'config/vitest/expectation-firefox-developer.ts',
                        'config/vitest/expectation-firefox-penultimate.ts',
                        'config/vitest/expectation-firefox-previous.ts',
                        'config/vitest/expectation-safari-current.ts',
                        'config/vitest/expectation-safari-penultimate.ts',
                        'config/vitest/expectation-safari-previous.ts',
                        'config/vitest/integration-chrome-canary.ts',
                        'config/vitest/integration-chrome-current.ts',
                        'config/vitest/integration-firefox-current.ts',
                        'config/vitest/integration-firefox-developer.ts',
                        'config/vitest/integration-node.ts',
                        'config/vitest/integration-safari-current.ts',
                        'config/vitest/unit.ts'
                    ],
                    // eslint-disable-next-line camelcase
                    maximumDefaultProjectFileMatchCount_THIS_WILL_SLOW_DOWN_LINTING: 18
                }
            }
        },
        rules: { '@typescript-eslint/strict-boolean-expressions': 'off' }
    }
]);
