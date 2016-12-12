module.exports = {
    build: {
        cmd: 'tsc -p src/tsconfig.json && rollup -c config/rollup/bundle.js && rollup -c config/rollup/script.js'
    }
};
