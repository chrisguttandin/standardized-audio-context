'use strict';

module.exports = {
    default: {
        crawl: false,
        customTests: [],
        dest: 'build/modernizr.js',
        options: [],
        tests: [
            'promises',
            'typedarrays',
            'webaudio'
        ],
        uglify: false
    }
};
