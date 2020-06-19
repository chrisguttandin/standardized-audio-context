module.exports = (config) => {
    config.set({
        basePath: '../../',

        browserNoActivityTimeout: 240000,

        browsers: ['Safari'],

        files: [
            'test/expectation/safari/any/**/*.js',
            {
                included: false,
                pattern: 'test/fixtures/**',
                served: true
            }
        ],

        frameworks: ['mocha', 'sinon-chai'],

        preprocessors: {
            'test/expectation/safari/any/**/*.js': 'webpack'
        },

        webpack: {
            mode: 'development',
            module: {
                rules: [
                    {
                        test: /\.ts?$/,
                        use: {
                            loader: 'ts-loader'
                        }
                    }
                ]
            },
            resolve: {
                extensions: ['.js', '.ts']
            }
        },

        webpackMiddleware: {
            noInfo: true
        }
    });
};
