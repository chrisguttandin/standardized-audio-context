import { env } from 'node:process';
import { webdriverio } from '@vitest/browser-webdriverio';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        watch: false,
        browser: {
            enabled: true,
            instances: env.CI
                ? env.TARGET === 'chrome'
                    ? [{ browser: 'chrome', name: 'Chrome', provider: webdriverio() }]
                    : env.TARGET === 'firefox'
                      ? [{ browser: 'firefox', name: 'Firefox', provider: webdriverio() }]
                      : []
                : [
                      {
                          browser: 'chrome',
                          name: 'Chrome',
                          provider: webdriverio({
                              capabilities: {
                                  'goog:chromeOptions': {
                                      args: ['--headless']
                                  }
                              }
                          })
                      },
                      {
                          browser: 'chrome',
                          name: 'Chrome Canary',
                          provider: webdriverio({
                              capabilities: {
                                  'goog:chromeOptions': {
                                      args: ['--headless'],
                                      binary: '/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary'
                                  }
                              }
                          })
                      },
                      {
                          name: 'Firefox Developer',
                          browser: 'firefox',
                          provider: webdriverio({
                              capabilities: {
                                  'moz:firefoxOptions': {
                                      args: ['-headless'],
                                      binary: '/Applications/Firefox\ Developer\ Edition.app/Contents/MacOS/firefox'
                                  }
                              }
                          })
                      },
                      {
                          browser: 'firefox',
                          name: 'Firefox',
                          provider: webdriverio({
                              capabilities: {
                                  'moz:firefoxOptions': {
                                      args: ['-headless']
                                  }
                              }
                          })
                      },
                      { browser: 'safari', name: 'Safari', provider: webdriverio() }
                  ]
        },
        dir: 'test/unit/',
        include: ['**/*.js']
    }
});
