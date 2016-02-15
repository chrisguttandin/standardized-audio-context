'use strict';

module.exports = {
    build: [
        'clean:build',
        'modernizr',
        'replace:modernizr'
    ],
    continuous: [
        'build',
        'karma:continuous'
    ],
    lint: [
        'eslint',
        'jshint'
    ],
    test: [
        'build',
        'karma:test'
    ]
};
