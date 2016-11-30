var common = require('./expectation.js');

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

    if (process.env.TRAVIS) {

        config.set({

            browsers: [
                'FirefoxSauceLabs'
            ],

            captureTimeout: 120000,

            customLaunchers: {
                FirefoxSauceLabs: {
                    base: 'SauceLabs',
                    browserName: 'firefox',
                    platform: 'OS X 10.11'
                }
            },

            tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER
        });

    } else {

        config.set({

            browsers: [
                'Firefox'
            ]

        });

    }

};
