'use strict';

module.exports = {
    continuous: [
        'karma:continuous'
    ],
    lint: [
        'eslint',
        'jshint'
    ],
    test: [
        'karma:test'
    ]
};
