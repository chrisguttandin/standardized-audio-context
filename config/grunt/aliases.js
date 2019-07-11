const { env } = require('process');

// eslint-disable-next-line padding-line-between-statements
const isTarget = (target, ...tasks) => {
    if (env.TARGET === undefined || env.TARGET === target) {
        return tasks;
    }

    return [ ];
};
const isType = (type, ...tasks) => {
    if (env.TYPE === undefined || env.TYPE === type) {
        return tasks;
    }

    return [ ];
};

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
        ...isType(
            'expectation',
            ...isTarget('chrome', 'karma:expectation-chrome'),
            ...isTarget(undefined, 'karma:expectation-chrome-canary'),
            ...isTarget('edge', 'karma:expectation-edge'),
            ...isTarget('firefox', 'karma:expectation-firefox'),
            ...isTarget(undefined, 'karma:expectation-firefox-developer'),
            ...isTarget('opera', 'karma:expectation-opera'),
            ...isTarget(undefined, 'karma:expectation-safari'),
            ...isTarget('safari-legacy', 'karma:expectation-safari-legacy')
        ),
        ...isType('integration', 'karma:integration'),
        ...isType('memory', 'sh:test-memory'),
        ...isType('unit', 'karma:unit')
    ]
};
