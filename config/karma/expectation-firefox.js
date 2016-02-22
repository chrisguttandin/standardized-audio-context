'use strict';

var common = require('./expectation.js');

module.exports = function (config) {

    common(config);

    config.set({

        browsers: [
            'Firefox'
        ],

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

};
