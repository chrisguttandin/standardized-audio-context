'use strict';

var common = require('./expectation.js');

module.exports = function (config) {

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
            'test/expectation/any/**/*.js': 'browserify',
            'test/expectation/firefox/any/**/*.js': 'browserify',
            'test/expectation/firefox/current/**/*.js': 'browserify'
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
                    platform: 'OS X 10.12'
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
