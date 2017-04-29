module.exports = {
    'build-es2015': {
        cmd: 'tsc -p src/tsconfig.json'
    },
    'build-es5': {
        cmd: 'rollup -c config/rollup/bundle.js'
    },
    'build-esm': {
        cmd: 'tsc -p src/tsconfig.json --declaration false --target es5 --outDir build/esm'
    },
    // @todo Generating the script with 'rollup -c config/rollup/script.js' doesn't work right now.
    'lint': {
        cmd: 'tslint -c config/tslint/src.json --project src/tsconfig.json --type-check src/**/*.ts'
    }
};
