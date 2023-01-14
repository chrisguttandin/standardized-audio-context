module.exports = (grunt) => {
    const continuous = grunt.option('continuous') === true;
    const fix = grunt.option('fix') === true;

    return {
        'build-es2019': {
            cmd: 'tsc --project src/tsconfig.json'
        },
        'build-es5': {
            cmd: 'rollup --config config/rollup/bundle.mjs'
        },
        'build-node': {
            cmd: 'babel ./build/es2019 --config-file ./config/babel/build.json --out-dir ./build/node'
        },
        'clean': {
            cmd: 'rimraf build/*'
        },
        'lint-config': {
            cmd: `eslint --config config/eslint/config.json --ext .js ${fix ? '--fix ' : ''}--report-unused-disable-directives *.js config/`
        },
        'lint-src': {
            cmd: 'tslint --config config/tslint/src.json --project src/tsconfig.json src/*.ts src/**/*.ts'
        },
        'lint-test': {
            cmd: `eslint --config config/eslint/test.json --ext .js ${fix ? '--fix ' : ''}--report-unused-disable-directives test/`
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
        'test-expectation-edge': {
            cmd: `karma start config/karma/config-expectation-edge.js ${continuous ? '--concurrency Infinity' : '--single-run'}`
        },
        'test-expectation-edge-legacy': {
            cmd: `karma start config/karma/config-expectation-edge-legacy.js ${continuous ? '--concurrency Infinity' : '--single-run'}`
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
