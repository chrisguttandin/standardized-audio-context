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

        };
    /* eslint-enable indent */

    if (process.env.TRAVIS) {
        configuration.browsers = [
            'ChromeCanarySauceLabs',
            'ChromeSauceLabs',
            // 'FirefoxDeveloperSauceLabs',
            // 'FirefoxSauceLabs',
            // 'SafariSauceLabs'
        ];

        configuration.captureTimeout = 120000;

        configuration.customLaunchers = {
            ChromeCanarySauceLabs: {
                base: 'SauceLabs',
                browserName: 'chrome',
                platform: 'OS X 10.11',
                version: 'dev'
            },
            ChromeSauceLabs: {
                base: 'SauceLabs',
                browserName: 'chrome',
                platform: 'OS X 10.11'
            },
            FirefoxDeveloperSauceLabs: {
                base: 'SauceLabs',
                browserName: 'firefox',
                platform: 'OS X 10.11',
                version: 'dev'
            },
            FirefoxSauceLabs: {
                base: 'SauceLabs',
                browserName: 'firefox',
                platform: 'OS X 10.11'
            },
            SafariSauceLabs: {
                base: 'SauceLabs',
                browserName: 'safari',
                platform: 'OS X 10.11',
                version: '9.0'
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
