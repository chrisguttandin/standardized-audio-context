const { env } = require('process');

module.exports = {
    build: [
        'clean:build',
        'modernizr',
        'replace:modernizr',
        'clean:modernizr',
        'sh:build-es2018',
        'sh:build-es5'
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
        ...(env.TARGET === 'chrome' && [ 'expectation', undefined ].includes(env.TYPE))
            ? [
                'karma:expectation-chrome'
            ]
            : (env.TARGET === 'edge' && [ 'expectation', undefined ].includes(env.TYPE))
                ? [
                    'karma:expectation-edge'
                ]
                : (env.TARGET === 'firefox' && [ 'expectation', undefined ].includes(env.TYPE))
                    ? [
                        'karma:expectation-firefox'
                    ]
                    : (env.TARGET === 'opera' && [ 'expectation', undefined ].includes(env.TYPE))
                        ? [
                            'karma:expectation-opera'
                        ]
                        : (env.TARGET === 'safari-legacy' && [ 'expectation', undefined ].includes(env.TYPE))
                            ? [
                                'karma:expectation-safari-legacy'
                            ]
                            : (env.TARGET === undefined && [ 'expectation', undefined ].includes(env.TYPE))
                                ? [
                                    'karma:expectation-chrome',
                                    'karma:expectation-chrome-canary',
                                    'karma:expectation-edge',
                                    'karma:expectation-firefox',
                                    'karma:expectation-firefox-developer',
                                    'karma:expectation-opera',
                                    'karma:expectation-safari',
                                    'karma:expectation-safari-legacy'
                                ]
                                : [ ],
        ...([ 'chrome', 'edge', 'firefox', 'opera', 'safari', undefined ].includes(env.TARGET) && [ 'integration', undefined ].includes(env.TYPE))
            ? [
                'karma:integration'
            ]
            : [ ],
        ...([ 'edge', 'firefox', undefined ].includes(env.TARGET) && [ 'unit', undefined ].includes(env.TYPE))
            ? [
                'karma:unit'
            ]
            : [ ],
        ...([ 'chromium', undefined ].includes(env.TARGET) && [ 'memory', undefined ].includes(env.TYPE))
            ? [
                'sh:test-memory'
            ]
            : [ ]
    ]
};
