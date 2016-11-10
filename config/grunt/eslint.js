module.exports = {
    config: {
        options: {
            configFile: 'config/eslint/config.json'
        },
        src: [
            '*.js',
            'config/**/*.js'
        ]
    },
    src: {
        options: {
            configFile: 'config/eslint/src.json'
        },
        src: [
            'src/**/*.js'
        ]
    },
    test: {
        options: {
            configFile: 'config/eslint/test.json'
        },
        src: [
            'test/**/*.js'
        ]
    }
};
