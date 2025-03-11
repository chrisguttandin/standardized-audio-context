module.exports = (grunt) => {
    const continuous = grunt.option('continuous') === true;

    return {
        'build': {
            cmd: 'npm run build'
        },
        'test-expectation-chrome': {
            cmd: `karma start config/karma/config-expectation-chrome.js ${continuous ? '--concurrency Infinity' : '--single-run'}`
        },
        'test-expectation-chrome-canary': {
            cmd: `karma start config/karma/config-expectation-chrome-canary.js ${continuous ? '--concurrency Infinity' : '--single-run'}`
        },
        'test-expectation-chrome-penultimate': {
            cmd: `karma start config/karma/config-expectation-chrome-penultimate.js ${continuous ? '--concurrency Infinity' : '--single-run'}`
        },
        'test-expectation-chrome-previous': {
            cmd: `karma start config/karma/config-expectation-chrome-previous.js ${continuous ? '--concurrency Infinity' : '--single-run'}`
        },
        'test-expectation-firefox': {
            cmd: `karma start config/karma/config-expectation-firefox.js ${continuous ? '--concurrency Infinity' : '--single-run'}`
        },
        'test-expectation-firefox-developer': {
            cmd: `karma start config/karma/config-expectation-firefox-developer.js ${
                continuous ? '--concurrency Infinity' : '--single-run'
            }`
        },
        'test-expectation-firefox-penultimate': {
            cmd: `karma start config/karma/config-expectation-firefox-penultimate.js ${continuous ? '--concurrency Infinity' : '--single-run'}`
        },
        'test-expectation-firefox-previous': {
            cmd: `karma start config/karma/config-expectation-firefox-previous.js ${continuous ? '--concurrency Infinity' : '--single-run'}`
        },
        'test-expectation-safari': {
            cmd: `karma start config/karma/config-expectation-safari.js ${continuous ? '--concurrency Infinity' : '--single-run'}`
        },
        'test-expectation-safari-penultimate': {
            cmd: `karma start config/karma/config-expectation-safari-penultimate.js ${continuous ? '--concurrency Infinity' : '--single-run'}`
        },
        'test-expectation-safari-previous': {
            cmd: `karma start config/karma/config-expectation-safari-previous.js ${continuous ? '--concurrency Infinity' : '--single-run'}`
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
