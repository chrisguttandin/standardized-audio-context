'use strict';

var common = require('./expectation.js');

module.exports = function (config) {

    common(config);

    config.set({

        browsers: [
            'Chrome'
        ],

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

};
