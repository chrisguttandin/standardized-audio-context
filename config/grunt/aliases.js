module.exports = {
    build: [
        'clean:build',
        'modernizr',
        'replace:modernizr',
        'clean:modernizr',
        'sh:build-es2015',
        'sh:build-es5',
        'sh:build-esm',
        'sh:build-script',
        'uglify'
    ],
    continuous: [
        'test',
        'watch:continuous'
    ],
    lint: [
        'eslint',
        // @todo Use grunt-lint again when it support the type-check option.
        'sh:lint'
    ],
    test: [
        'build',
        'karma:test',
        'karma:test-chrome',
        // 'karma:test-chrome-canary',
        'karma:test-edge',
        'karma:test-firefox',
        // 'karma:test-firefox-developer',
        'karma:test-opera'
        // @todo Enable Safari tests again, when BrowserStack supports Safari 10.1 or above.
        // 'karma:test-safari'
    ]
};
