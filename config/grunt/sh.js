module.exports = {
    'build-es2018': {
        cmd: 'tsc -p src/tsconfig.json'
    },
    'build-es5': {
        cmd: 'rollup -c config/rollup/bundle.js'
    },
    'lint': {
        cmd: 'tslint --config config/tslint/src.json --project src/tsconfig.json src/*.ts src/**/*.ts'
    },
    'test-integration': {
        cmd: 'mocha --bail --recursive --require config/mocha/config-integration.js test/integration'
    },
    'test-memory': {
        cmd: 'mocha --bail --recursive --require config/mocha/config-memory.js test/memory'
    }
};
