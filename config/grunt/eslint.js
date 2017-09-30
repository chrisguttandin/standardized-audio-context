module.exports = {
    config: {
        options: {
            configFile: 'config/eslint/config.json',
            reportUnusedDisableDirectives: true
        },
        src: [ '*.js', 'config/**/*.js' ]
    },
    src: {
        options: {
            configFile: 'config/eslint/src.json',
            reportUnusedDisableDirectives: true
        },
        src: [ 'src/**/*.js' ]
    },
    test: {
        options: {
            configFile: 'config/eslint/test.json',
            reportUnusedDisableDirectives: true
        },
        src: [ 'test/**/*.js' ]
    }
};
