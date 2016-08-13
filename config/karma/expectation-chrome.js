'use strict';

var common = require('./expectation.js');

module.exports = function (config) {

    common(config);

    config.set({

        files: [
            'test/expectation/any/**/*.js',
            'test/expectation/chrome/any/**/*.js',
            'test/expectation/chrome/current/**/*.js',
            {
                included: false,
                pattern: 'test/fixtures/**',
                served: true
            }
        ],

        preprocessors: {
            'test/expectation/any/**/*.js': 'browserify',
            'test/expectation/chrome/any/**/*.js': 'browserify',
            'test/expectation/chrome/current/**/*.js': 'browserify'
        }

    });

    if (process.env.TRAVIS) {

        config.set({

            browserStack: {
                accessKey: process.env.BROWSER_STACK_ACCESS_KEY,
                username: process.env.BROWSER_STACK_USERNAME
            },

            browsers: [
                'ChromeBrowserStack'
            ],

            captureTimeout: 120000,

            customLaunchers: {
                ChromeBrowserStack: {
                    base: 'BrowserStack',
                    browser: 'chrome',
                    os: 'OS X',
                    os_version: 'El Capitan' // eslint-disable-line camelcase
                }
            },

            tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER
        });

    } else {

        config.set({

            browsers: [
                'Chrome'
            ]

        });

    }

};
