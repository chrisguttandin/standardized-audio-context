'use strict';

var browserify = require('../../package.json').browserify;

module.exports = function (config) {

    config.set({

        basePath: '../../',

        browserify: {
            transform: browserify.transform
        },

        frameworks: [
            'browserify',
            'mocha',
            'sinon-chai'
        ],

        singleRun: true

    });

};
