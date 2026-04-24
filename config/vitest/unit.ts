import { env } from 'node:process';
import { webdriverio } from '@vitest/browser-webdriverio';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        bail: 1,
        browser: {
            enabled: true,
            instances: env.CI
                ? env.TARGET === 'chrome'
                    ? [{ browser: 'chrome', name: 'Chrome', provider: webdriverio() }]
                    : env.TARGET === 'firefox'
                      ? [{ browser: 'firefox', name: 'Firefox', provider: webdriverio() }]
                      : []
                : [
                      { browser: 'chrome', headless: true, name: 'Chrome', provider: webdriverio() },
                      {
                          browser: 'chrome',
                          headless: true,
                          name: 'Chrome Canary',
                          provider: webdriverio({
                              capabilities: {
                                  'goog:chromeOptions': {
                                      binary: '/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary'
                                  }
                              }
                          })
                      },
                      {
                          browser: 'firefox',
                          headless: true,
                          name: 'Firefox Developer',
                          provider: webdriverio({
                              capabilities: {
                                  'moz:firefoxOptions': { binary: '/Applications/Firefox\ Developer\ Edition.app/Contents/MacOS/firefox' }
                              }
                          })
                      },
                      { browser: 'firefox', headless: true, name: 'Firefox', provider: webdriverio() },
                      { browser: 'safari', headless: false, name: 'Safari', provider: webdriverio() }
                  ]
        },
        dir: 'test/unit/',
        include: ['**/*.js'],
        watch: false
    }
});
