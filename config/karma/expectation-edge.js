var common = require('./expectation.js');

module.exports = (config) => {

    common(config);

    config.set({

        browsers: [
            'EdgeBrowserStack'
        ],

        captureTimeout: 120000,

        customLaunchers: {
            EdgeBrowserStack: {
                base: 'BrowserStack',
                browser: 'edge',
                os: 'Windows',
                os_version: '10' // eslint-disable-line camelcase
            }
        },

        files: [
            'test/expectation/any/**/*.js',
            'test/expectation/edge/**/*.js',
            {
                included: false,
                pattern: 'test/fixtures/**',
                served: true
            }
        ],

        preprocessors: {
            'test/expectation/any/**/*.js': 'webpack',
            'test/expectation/edge/**/*.js': 'webpack'
        }

    });

    if (process.env.TRAVIS) {

        config.set({

            browserStack: {
                accessKey: process.env.BROWSER_STACK_ACCESS_KEY,
                username: process.env.BROWSER_STACK_USERNAME
            }
        });

    } else {

        const environment = require('../environment/local.json');

        config.set({

            browserStack: environment.browserStack

        });

    }

};
