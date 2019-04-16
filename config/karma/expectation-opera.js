const { env } = require('process');
const common = require('./expectation.js');
const { DefinePlugin } = require('webpack');

module.exports = (config) => {

    common(config);

    config.set({

        files: [
            'test/expectation/any/**/*.js',
            'test/expectation/opera/**/*.js',
            {
                included: false,
                pattern: 'test/fixtures/**',
                served: true
            }
        ],

        preprocessors: {
            'test/expectation/any/**/*.js': 'webpack',
            'test/expectation/opera/**/*.js': 'webpack'
        },

        webpack: {
            mode: 'development',
            plugins: [
                new DefinePlugin({
                    'process.env': {
                        TRAVIS: JSON.stringify(env.TRAVIS)
                    }
                })
            ]
        }

    });

    if (env.TRAVIS) {

        config.set({

            browserStack: {
                accessKey: env.BROWSER_STACK_ACCESS_KEY,
                username: env.BROWSER_STACK_USERNAME
            },

            browsers: [
                'OperaBrowserStack'
            ],

            captureTimeout: 120000,

            customLaunchers: {
                OperaBrowserStack: {
                    base: 'BrowserStack',
                    browser: 'opera',
                    os: 'OS X',
                    os_version: 'Mojave' // eslint-disable-line camelcase
                }
            },

            tunnelIdentifier: env.TRAVIS_JOB_NUMBER

        });

    } else {

        config.set({

            browsers: [
                'OperaWithNoRequiredUserGestureAndNoThrottling'
            ],

            customLaunchers: {
                OperaWithNoRequiredUserGestureAndNoThrottling: {
                    base: 'Opera',
                    flags: [
                        '--autoplay-policy=no-user-gesture-required',
                        '--disable-background-timer-throttling',
                        '--disable-renderer-backgrounding'
                    ]
                }
            }

        });

    }

};
