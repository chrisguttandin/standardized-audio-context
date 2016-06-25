'use strict';

module.exports = {
    src: {
        options: {
            configFile: 'config/eslint/src.json'
        },
        src: [
            'src/**/*.js'
        ]
    },
    config: {
        options: {
            configFile: 'config/eslint/config.json'
        },
        src: [
            '*.js',
            'config/**/*.js'
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
