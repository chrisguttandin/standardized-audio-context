'use strict';

module.exports = {
    build: [
        'clean:build',
        'modernizr',
        'replace:modernizr'
    ],
    continuous: [
        'test',
        'watch:continuous'
    ],
    lint: [
        'eslint'
    ],
    test: [
        'build',
        'karma:test',
        'karma:test-chrome',
        // 'karma:test-chrome-canary',
        'karma:test-edge',
        'karma:test-firefox',
        // 'karma:test-firefox-developer',
        // 'karma:test-opera',
        'karma:test-safari'
    ]
};
