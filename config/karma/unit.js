'use strict';

var browserify = require('../../package.json').browserify;

module.exports = function (config) {

    config.set({

        basePath: '../../',

        browserify: {
            transform: browserify.transform
        },

        files: [
            {
                included: false,
                pattern: 'test/fixtures/**',
                served: true
            },
            'test/unit/**/*.js'
        ],

        frameworks: [
            'browserify',
            'mocha',
            'sinon-chai' // implicitly uses chai too
        ],

        preprocessors: {
            'test/unit/**/*.js': 'browserify'
        },

        singleRun: true

    });

    if (process.env.TRAVIS) {

        config.set({

            browsers: [
                'ChromeBrowserStack',
                'EdgeBrowserStack',
                'FirefoxBrowserStack',
                'SafariBrowserStack'
            ],

            browserStack: {
                accessKey: process.env.BROWSER_STACK_ACCESS_KEY,
                username: process.env.BROWSER_STACK_USERNAME
            },

            captureTimeout: 120000,

            customLaunchers: {
                ChromeBrowserStack: {
                    base: 'BrowserStack',
                    browser: 'chrome',
                    os: 'OS X',
                    os_version: 'El Capitan' // eslint-disable-line camelcase
                },
                EdgeBrowserStack: {
                    base: 'BrowserStack',
                    browser: 'edge',
                    os: 'Windows',
                    os_version: '10' // eslint-disable-line camelcase
                },
                FirefoxBrowserStack: {
                    base: 'BrowserStack',
                    browser: 'firefox',
                    os: 'OS X',
                    os_version: 'El Capitan' // eslint-disable-line camelcase
                },
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
                'Chrome',
                'ChromeCanary',
                'Firefox',
                'FirefoxDeveloper',
                'Opera',
                'Safari'
            ]

        });

    }

};
