const common = require('./expectation.js');

module.exports = (config) => {

    common(config);

    config.set({

        browsers: [
            'FirefoxDeveloperHeadless'
        ],

        files: [
            'test/expectation/firefox/any/**/*.js',
            'test/expectation/firefox/developer/**/*.js',
            {
                included: false,
                pattern: 'test/fixtures/**',
                served: true
            }
        ],

        preprocessors: {
            'test/expectation/firefox/any/**/*.js': 'webpack',
            'test/expectation/firefox/developer/**/*.js': 'webpack'
        }

    });

};
