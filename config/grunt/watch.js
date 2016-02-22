'use strict';

module.exports = {
    continuous: {
        files: [
            'src/**/*.js',
            'test/expectation/**/*.js',
            'test/unit/**/*.js'
        ],
        tasks: [
            'test'
        ]
    }
};
