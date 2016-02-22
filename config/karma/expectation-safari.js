'use strict';

var common = require('./expectation.js');

module.exports = function (config) {

    common(config);

    config.set({

        browsers: [
            'Safari'
        ],

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

};
