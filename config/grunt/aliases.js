const COMMON_TEST_TASKS = [
    'build',
    'karma:test',
    'karma:test-chrome',
    'karma:test-edge',
    'karma:test-firefox',
    'karma:test-opera',
    'karma:test-safari',
    'karma:integration'
];

module.exports = {
    build: [
        'clean:build',
        'modernizr',
        'replace:modernizr',
        'clean:modernizr',
        'sh:build-es2015',
        'sh:build-es5',
        'sh:build-esm'
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
    test: (process.env.TRAVIS)
        ? COMMON_TEST_TASKS
        : [ ...COMMON_TEST_TASKS, 'karma:test-chrome-canary', 'karma:test-firefox-developer' ]
};
