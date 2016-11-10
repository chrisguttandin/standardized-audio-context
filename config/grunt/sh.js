module.exports = {
    build: {
        cmd: 'tsc -p src/tsconfig.json && rollup -c config/rollup/bundle.js'
    }
};
