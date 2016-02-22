'use strict';

module.exports = {
    'test': {
        configFile: 'config/karma/unit.js'
    },
    'test-chrome': {
        configFile: 'config/karma/expectation-chrome.js'
    },
    'test-chrome-canary': {
        configFile: 'config/karma/expectation-chrome-canary.js'
    },
    'test-firefox': {
        configFile: 'config/karma/expectation-firefox.js'
    },
    'test-firefox-developer': {
        configFile: 'config/karma/expectation-firefox-developer.js'
    },
    'test-opera': {
        configFile: 'config/karma/expectation-opera.js'
    },
    'test-safari': {
        configFile: 'config/karma/expectation-safari.js'
    }
};
