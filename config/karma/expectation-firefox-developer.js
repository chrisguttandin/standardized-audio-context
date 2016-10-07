'use strict';

var common = require('./expectation.js');

module.exports = function (config) {

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
            'test/expectation/any/**/*.js': 'browserify',
            'test/expectation/firefox/any/**/*.js': 'browserify',
            'test/expectation/firefox/developer/**/*.js': 'browserify'
        }

    });

    if (process.env.TRAVIS) {

        config.set({

            browsers: [
                'FirefoxDeveloperSauceLabs'
            ],

            captureTimeout: 120000,

            customLaunchers: {
                FirefoxDeveloperSauceLabs: {
                    base: 'SauceLabs',
                    browserName: 'firefox',
                    platform: 'OS X 10.12',
                    version: 'dev'
                }
            },

            tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER
        });

    } else {

        config.set({

            browsers: [
                'FirefoxDeveloper'
            ]

        });

    }

};
