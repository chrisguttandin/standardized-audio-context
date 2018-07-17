const { env } = require('process');
const common = require('./expectation.js');

module.exports = (config) => {

    common(config);

    config.set({

        files: [
            'test/expectation/any/**/*.js',
            'test/expectation/firefox/any/**/*.js',
            'test/expectation/firefox/current/**/*.js',
            {
                included: false,
                pattern: 'test/fixtures/**',
                served: true
            }
        ],

        preprocessors: {
            'test/expectation/any/**/*.js': 'webpack',
            'test/expectation/firefox/any/**/*.js': 'webpack',
            'test/expectation/firefox/current/**/*.js': 'webpack'
        }

    });

    if (env.TRAVIS) {

        config.set({

            browserStack: {
                accessKey: env.BROWSER_STACK_ACCESS_KEY,
                username: env.BROWSER_STACK_USERNAME
            },

            browsers: [
                'FirefoxBrowserStack'
            ],

            captureTimeout: 120000,

            customLaunchers: {
                FirefoxBrowserStack: {
                    base: 'BrowserStack',
                    browser: 'firefox',
                    os: 'OS X',
                    os_version: 'Sierra' // eslint-disable-line camelcase
                }
            },

            tunnelIdentifier: env.TRAVIS_JOB_NUMBER

        });

    } else {

        config.set({

            browsers: [
                'FirefoxHeadless'
            ]

        });

    }

};
