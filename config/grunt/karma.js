'use strict';

module.exports = {
    'continuous': {
        configFile: 'config/karma/unit.js'
    },
    'test': {
        configFile: 'config/karma/unit.js',
        singleRun: true
    }
};
