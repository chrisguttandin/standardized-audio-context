const common = require('./expectation.js');

module.exports = (config) => {

    common(config);

    config.set({

        browsers: [
            'Safari'
        ],

        files: [
            'test/expectation/any/**/*.js',
            'test/expectation/safari/any/**/*.js',
            'test/expectation/safari/current/**/*.js',
            {
                included: false,
                pattern: 'test/fixtures/**',
                served: true
            }
        ],

        preprocessors: {
            'test/expectation/any/**/*.js': 'webpack',
            'test/expectation/safari/any/**/*.js': 'webpack',
            'test/expectation/safari/current/**/*.js': 'webpack'
        }

    });

};
