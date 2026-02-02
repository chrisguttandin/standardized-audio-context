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
                : [
                      {
                          browser: 'chrome',
                          headless: true,
                          name: 'Chrome Canary',
                          provider: webdriverio({
                              capabilities: {
                                  'goog:chromeOptions': {
                                      args: ['--autoplay-policy=no-user-gesture-required', '--mute-audio'],
                                      binary: '/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary'
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
