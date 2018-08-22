module.exports = {
    'build-es2015': {
        cmd: 'tsc -p src/tsconfig.json'
    },
    'build-es5': {
        cmd: 'rollup -c config/rollup/bundle.js'
    },
    'build-esm': {
        cmd: 'tsc -p src/tsconfig.json --declaration false --declarationMap false --target es5 --outDir build/esm'
    },
    'lint': {
        cmd: 'tslint --config config/tslint/src.json --exclude src/browsernizr.ts --project src/tsconfig.json src/*.ts src/**/*.ts'
    }
};
