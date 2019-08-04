const { env } = require('process');

// eslint-disable-next-line padding-line-between-statements
const filter = (predicate, ...tasks) => (predicate) ? tasks : [ ];
const isTarget = (...targets) => (env.TARGET === undefined || targets.includes(env.TARGET));
const isType = (...types) => (env.TYPE === undefined || types.includes(env.TYPE));

module.exports = {
    build: [
        'clean:build',
        'sh:build-es2018',
        'sh:build-es5',
        'babel:build'
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
        ...filter(
            isType('expectation'),
            ...filter(isTarget('chrome'), 'karma:expectation-chrome'),
            ...filter(isTarget(undefined), 'karma:expectation-chrome-canary'),
            ...filter(isTarget('edge'), 'karma:expectation-edge'),
            ...filter(isTarget('firefox'), 'karma:expectation-firefox'),
            ...filter(isTarget(undefined), 'karma:expectation-firefox-developer'),
            ...filter(isTarget('firefox-legacy'), 'karma:expectation-firefox-legacy'),
            ...filter(isTarget('opera'), 'karma:expectation-opera'),
            ...filter(isTarget(undefined), 'karma:expectation-safari'),
            ...filter(isTarget('safari-legacy'), 'karma:expectation-safari-legacy')
        ),
        ...filter(
            isType('integration'),
            ...filter(isTarget('chrome', 'edge', 'firefox', 'opera', 'safari'), 'karma:integration'),
            ...filter(isTarget('node'), 'sh:test-integration')
        ),
        ...filter(isType('memory'), 'sh:test-memory'),
        ...filter(isType('unit'), 'karma:unit')
    ]
};
