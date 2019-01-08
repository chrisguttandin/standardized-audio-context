const common = require('./expectation.js');

module.exports = (config) => {

    common(config);

    config.set({

        browserDisconnectTimeout: 10000,

        browsers: [
            'ChromeHeadlessWithNoRequiredUserGesture'
        ],

        customLaunchers: {
            ChromeHeadlessWithNoRequiredUserGesture: {
                base: 'ChromeHeadless',
                flags: [ '--autoplay-policy=no-user-gesture-required' ]
            }
        },

        files: [
            'test/expectation/any/**/*.js',
            'test/expectation/chrome/any/**/*.js',
            'test/expectation/chrome/current/**/*.js',
            {
                included: false,
                pattern: 'test/fixtures/**',
                served: true
            }
        ],

        preprocessors: {
            'test/expectation/any/**/*.js': 'webpack',
            'test/expectation/chrome/any/**/*.js': 'webpack',
            'test/expectation/chrome/current/**/*.js': 'webpack'
        }

    });

};
