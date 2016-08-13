'use strict';

var common = require('./expectation.js');

module.exports = function (config) {

    common(config);

    config.set({

        files: [
            'test/expectation/any/**/*.js',
            'test/expectation/safari/**/*.js',
            {
                included: false,
                pattern: 'test/fixtures/**',
                served: true
            }
        ],

        preprocessors: {
            'test/expectation/any/**/*.js': 'browserify',
            'test/expectation/safari/**/*.js': 'browserify'
        }

    });

    if (process.env.TRAVIS) {

        config.set({

            browserStack: {
                accessKey: process.env.BROWSER_STACK_ACCESS_KEY,
                username: process.env.BROWSER_STACK_USERNAME
            },

            browsers: [
                'SafariBrowserStack'
            ],

            captureTimeout: 120000,

            customLaunchers: {
                SafariBrowserStack: {
                    base: 'BrowserStack',
                    browser: 'safari',
                    os: 'OS X',
                    os_version: 'El Capitan' // eslint-disable-line camelcase
                }
            },

            tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER

        });

    } else {

        config.set({

            browsers: [
                'Safari'
            ]

        });

    }

};
