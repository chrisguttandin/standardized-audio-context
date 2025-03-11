const { env } = require('process');

// eslint-disable-next-line padding-line-between-statements
const filter = (predicate, ...tasks) => (predicate ? tasks : []);
const isTarget = (...targets) => env.TARGET === undefined || targets.includes(env.TARGET);
const isType = (...types) => env.TYPE === undefined || types.includes(env.TYPE);

module.exports = {
    build: ['sh:build'],
    test: [
        'build',
        ...filter(
            isType('expectation'),
            ...filter(isTarget('chrome'), 'sh:test-expectation-chrome'),
            ...filter(isTarget('chrome-canary'), 'sh:test-expectation-chrome-canary'),
            ...filter(isTarget('chrome-penultimate'), 'sh:test-expectation-chrome-penultimate'),
            ...filter(isTarget('chrome-previous'), 'sh:test-expectation-chrome-previous'),
            ...filter(isTarget('firefox'), 'sh:test-expectation-firefox'),
            ...filter(isTarget('firefox-developer'), 'sh:test-expectation-firefox-developer'),
            ...filter(isTarget('firefox-penultimate'), 'sh:test-expectation-firefox-penultimate'),
            ...filter(isTarget('firefox-previous'), 'sh:test-expectation-firefox-previous'),
            ...filter(isTarget('safari'), 'sh:test-expectation-safari'),
            ...filter(isTarget('safari-penultimate'), 'sh:test-expectation-safari-penultimate'),
            ...filter(isTarget('safari-previous'), 'sh:test-expectation-safari-previous')
        ),
        ...filter(
            isType('integration'),
            ...filter(isTarget('chrome', 'firefox', 'safari'), 'sh:test-integration-browser'),
            ...filter(isTarget('node'), 'sh:test-integration-node')
        ),
        ...filter(isType('memory'), 'sh:test-memory'),
        ...filter(isType('unit'), 'sh:test-unit')
    ]
};
