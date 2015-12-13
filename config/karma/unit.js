'use strict';

var browserify = require('../../package.json').browserify;

module.exports = function (config) {

    /* eslint-disable indent */
    var configuration = {

            basePath: '../../',

            browserify: {
                transform: browserify.transform
            },

            files: [
                {
                    included: false,
                    pattern: 'test/fixtures/**',
                    served: true,
                    watched: true,
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
            }

        };
    /* eslint-enable indent */

    if (process.env.TRAVIS) {
        configuration.browsers = [
            'ChromeCanarySauceLabs',
            // 'FirefoxDeveloperSauceLabs'
        ];

        configuration.captureTimeout = 120000;

        configuration.customLaunchers = {
            ChromeCanarySauceLabs: {
                base: 'SauceLabs',
                browserName: 'chrome',
                platform: 'OS X 10.11',
                version: 'dev'
            },
            FirefoxDeveloperSauceLabs: {
                base: 'SauceLabs',
                browserName: 'firefox',
                platform: 'OS X 10.11',
                version: 'dev'
            }
        };

        configuration.tunnelIdentifier = process.env.TRAVIS_JOB_NUMBER;
    } else {
        configuration.browsers = [
            'Chrome',
            'ChromeCanary',
            'Firefox',
            'FirefoxDeveloper',
            'Opera',
            'Safari'
        ];
    }

    config.set(configuration);

};
