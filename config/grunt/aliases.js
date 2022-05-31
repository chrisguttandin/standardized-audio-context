const { env } = require('process');

// eslint-disable-next-line padding-line-between-statements
const filter = (predicate, ...tasks) => (predicate ? tasks : []);
const isTarget = (...targets) => env.TARGET === undefined || targets.includes(env.TARGET);
const isType = (...types) => env.TYPE === undefined || types.includes(env.TYPE);

module.exports = {
    build: ['sh:clean', 'sh:build-es2019', 'sh:build-es5', 'sh:build-node'],
    lint: ['sh:lint-config', 'sh:lint-src', 'sh:lint-test'],
    test: [
        'build',
        ...filter(
            isType('expectation'),
            ...filter(isTarget('chrome'), 'sh:test-expectation-chrome'),
            ...filter(isTarget(), 'sh:test-expectation-chrome-canary'),
            ...filter(isTarget('chrome-legacy'), 'sh:test-expectation-chrome-legacy'),
            ...filter(isTarget('edge'), 'sh:test-expectation-edge'),
            ...filter(isTarget('edge-legacy'), 'sh:test-expectation-edge-legacy'),
            ...filter(isTarget('firefox'), 'sh:test-expectation-firefox'),
            ...filter(isTarget(), 'sh:test-expectation-firefox-developer'),
            ...filter(isTarget('firefox-legacy'), 'sh:test-expectation-firefox-legacy'),
            ...filter(isTarget(), 'sh:test-expectation-safari'),
            ...filter(isTarget('safari-legacy'), 'sh:test-expectation-safari-legacy')
        ),
        ...filter(
            isType('integration'),
            ...filter(isTarget('chrome', 'edge', 'firefox', 'safari'), 'sh:test-integration-browser'),
            ...filter(isTarget('node'), 'sh:test-integration-node')
        ),
        ...filter(isType('memory'), 'sh:test-memory'),
        ...filter(isType('unit'), 'sh:test-unit')
    ]
};
