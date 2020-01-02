const common = require('./expectation.js');

module.exports = (config) => {

    common(config);

    config.set({

        browserDisconnectTimeout: 20000,

        browsers: [
            'ChromeCanaryHeadlessWithNoRequiredUserGesture'
        ],

        customLaunchers: {
            ChromeCanaryHeadlessWithNoRequiredUserGesture: {
                base: 'ChromeCanaryHeadless',
                flags: [ '--autoplay-policy=no-user-gesture-required' ]
            }
        },

        files: [
            'test/expectation/chrome/any/**/*.js',
            'test/expectation/chrome/canary/**/*.js',
            {
                included: false,
                pattern: 'test/fixtures/**',
                served: true
            }
        ],

        preprocessors: {
            'test/expectation/chrome/any/**/*.js': 'webpack',
            'test/expectation/chrome/canary/**/*.js': 'webpack'
        }

    });

};
