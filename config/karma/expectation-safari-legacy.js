const { env } = require('process');
const common = require('./expectation.js');

module.exports = (config) => {

    common(config);

    config.set({

        browsers: [
            'SafariBrowserStack'
        ],

        captureTimeout: 120000,

        customLaunchers: {
            SafariBrowserStack: {
                base: 'BrowserStack',
                browser: 'Safari',
                os: 'OS X',
                os_version: 'High Sierra', // eslint-disable-line camelcase
                version: '11.1'
            }
        },

        files: [
            'test/expectation/any/**/*.js',
            'test/expectation/safari/any/**/*.js',
            'test/expectation/safari/legacy/**/*.js',
            {
                included: false,
                pattern: 'test/fixtures/**',
                served: true
            }
        ],

        preprocessors: {
            'test/expectation/any/**/*.js': 'webpack',
            'test/expectation/safari/any/**/*.js': 'webpack',
            'test/expectation/safari/legacy/**/*.js': 'webpack'
        }

    });

    if (env.TRAVIS) {

        config.set({

            browserStack: {
                accessKey: env.BROWSER_STACK_ACCESS_KEY,
                username: env.BROWSER_STACK_USERNAME
            }

        });

    } else {

        const environment = require('../environment/local.json');

        config.set({

            browserStack: environment.browserStack

        });

    }

};
