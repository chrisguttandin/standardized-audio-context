'use strict';

module.exports = function (config) {

    config.set({

        basePath: '../../',

        browsers: [
            'Chrome',
            'ChromeCanary',
            'Firefox',
            'FirefoxAurora'
        ],

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

    });

};
