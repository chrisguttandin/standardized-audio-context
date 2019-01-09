const { env } = require('process');
const common = require('./expectation.js');

module.exports = (config) => {

    common(config);

    config.set({

        files: [
            'test/expectation/any/**/*.js',
            'test/expectation/firefox/any/**/*.js',
            'test/expectation/firefox/developer/**/*.js',
            {
                included: false,
                pattern: 'test/fixtures/**',
                served: true
            }
        ],

        preprocessors: {
            'test/expectation/any/**/*.js': 'webpack',
            'test/expectation/firefox/any/**/*.js': 'webpack',
            'test/expectation/firefox/developer/**/*.js': 'webpack'
        }

    });

    if (env.TRAVIS) {

        config.set({

            browsers: [
                'FirefoxDeveloperSauceLabs'
            ],

            captureTimeout: 120000,

            customLaunchers: {
                FirefoxDeveloperSauceLabs: {
                    base: 'SauceLabs',
                    browserName: 'firefox',
                    platform: 'OS X 10.14',
                    version: 'dev'
                }
            },

            tunnelIdentifier: env.TRAVIS_JOB_NUMBER

        });

    } else {

        config.set({

            browsers: [
                'FirefoxDeveloperHeadless'
            ]

        });

    }

};
