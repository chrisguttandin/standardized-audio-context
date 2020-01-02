const common = require('./expectation.js');

module.exports = (config) => {

    common(config);

    config.set({

        browsers: [
            'Safari'
        ],

        files: [
            'test/expectation/safari/any/**/*.js',
            {
                included: false,
                pattern: 'test/fixtures/**',
                served: true
            }
        ],

        preprocessors: {
            'test/expectation/safari/any/**/*.js': 'webpack'
        }

    });

};
