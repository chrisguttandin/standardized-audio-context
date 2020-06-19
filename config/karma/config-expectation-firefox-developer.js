module.exports = (config) => {
    config.set({
        basePath: '../../',

        browserNoActivityTimeout: 240000,

        browsers: ['FirefoxDeveloperHeadless'],

        files: [
            'test/expectation/firefox/any/**/*.js',
            'test/expectation/firefox/developer/**/*.js',
            {
                included: false,
                pattern: 'test/fixtures/**',
                served: true
            }
        ],

        frameworks: ['mocha', 'sinon-chai'],

        preprocessors: {
            'test/expectation/firefox/any/**/*.js': 'webpack',
            'test/expectation/firefox/developer/**/*.js': 'webpack'
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
