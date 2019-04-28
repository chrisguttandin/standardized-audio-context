module.exports = {
    'build-es2018': {
        cmd: 'tsc -p src/tsconfig.json'
    },
    'build-es5': {
        cmd: 'rollup -c config/rollup/bundle.js'
    },
    'lint': {
        cmd: 'tslint --config config/tslint/src.json --exclude src/browsernizr.ts --project src/tsconfig.json src/*.ts src/**/*.ts'
    },
    'test-integration': {
        cmd: 'mocha --bail --require config/mocha/config-integration.js test/integration/memory.js'
    }
};
