'use strict';

module.exports = {
    config: {
        options: {
            jshintrc: 'config/jshint/config.json'
        },
        src: [
            'config/**/*.js'
        ]
    },
    src: {
        options: {
            jshintrc: 'config/jshint/src.json'
        },
        src: [
            'src/**/*.js'
        ]
    },
    root: {
        options: {
            jshintrc: 'config/jshint/root.json'
        },
        src: [
            '*.js'
        ]
    },
    test: {
        options: {
            jshintrc: 'config/jshint/test.json'
        },
        src: [
            'test/**/*.js'
        ]
    }
};
