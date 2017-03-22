module.exports = {
    build: [
        'clean:build',
        'modernizr',
        'replace:modernizr',
        'clean:modernizr',
        'sh:build',
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
        'karma:test-opera',
        'karma:test-safari'
    ]
};
