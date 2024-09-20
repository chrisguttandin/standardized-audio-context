module.exports = (grunt) => {
    const continuous = grunt.option('continuous') === true;

    return {
        'build': {
            cmd: 'npm run build'
        },
        'lint-config': {
            cmd: 'npm run lint:config'
        },
        'lint-src': {
            cmd: 'npm run lint:src'
        },
        'lint-test': {
            cmd: 'npm run lint:test'
        },
        'test-expectation-chrome': {
            cmd: `karma start config/karma/config-expectation-chrome.js ${continuous ? '--concurrency Infinity' : '--single-run'}`
        },
        'test-expectation-chrome-canary': {
            cmd: `karma start config/karma/config-expectation-chrome-canary.js ${continuous ? '--concurrency Infinity' : '--single-run'}`
        },
        'test-expectation-chrome-legacy': {
            cmd: `karma start config/karma/config-expectation-chrome-legacy.js ${continuous ? '--concurrency Infinity' : '--single-run'}`
        },
        'test-expectation-firefox': {
            cmd: `karma start config/karma/config-expectation-firefox.js ${continuous ? '--concurrency Infinity' : '--single-run'}`
        },
        'test-expectation-firefox-developer': {
            cmd: `karma start config/karma/config-expectation-firefox-developer.js ${
                continuous ? '--concurrency Infinity' : '--single-run'
            }`
        },
        'test-expectation-firefox-legacy': {
            cmd: `karma start config/karma/config-expectation-firefox-legacy.js ${continuous ? '--concurrency Infinity' : '--single-run'}`
        },
        'test-expectation-safari': {
            cmd: `karma start config/karma/config-expectation-safari.js ${continuous ? '--concurrency Infinity' : '--single-run'}`
        },
        'test-expectation-safari-legacy': {
            cmd: `karma start config/karma/config-expectation-safari-legacy.js ${continuous ? '--concurrency Infinity' : '--single-run'}`
        },
        'test-integration-browser': {
            cmd: `karma start config/karma/config-integration.js ${continuous ? '--concurrency Infinity' : '--single-run'}`
        },
        'test-integration-node': {
            cmd: 'mocha --bail --parallel --recursive --require config/mocha/config-integration.js test/integration'
        },
        'test-memory': {
            cmd: 'mocha --bail --parallel --recursive --require config/mocha/config-memory.js test/memory'
        },
        'test-unit': {
            cmd: `karma start config/karma/config-unit.js ${continuous ? '--concurrency Infinity' : '--single-run'}`
        }
    };
};
