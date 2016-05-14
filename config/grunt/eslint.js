'use strict';

module.exports = {
    src: {
        options: {
            configFile: 'config/eslint/src.json',
            parserOptions: {
                sourceType: 'module'
            }
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
    }
};
