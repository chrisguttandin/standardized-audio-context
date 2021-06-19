const { env } = require('process');
const { DefinePlugin } = require('webpack');

module.exports = (config) => {
    config.set({
        basePath: '../../',

        browserDisconnectTimeout: 100000,

        browserNoActivityTimeout: 100000,

        browsers: ['EdgeSauceLabs'],

        concurrency: 1,

        customLaunchers: {
            EdgeSauceLabs: {
                base: 'SauceLabs',
                browserName: 'MicrosoftEdge',
                captureTimeout: 300,
                platform: 'macOS 11.00',
                version: '81.0'
            }
        },

        files: [
            {
                included: false,
                pattern: 'test/fixtures/**',
                served: true,
                watched: true
            },
            'test/expectation/edge/any/**/*.js',
            'test/expectation/edge/legacy/**/*.js'
        ],

        frameworks: ['mocha', 'sinon-chai'],

        mime: {
            'application/javascript': ['xs']
        },

        preprocessors: {
            'test/expectation/edge/any/**/*.js': 'webpack',
            'test/expectation/edge/legacy/**/*.js': 'webpack'
        },

        reporters: ['dots'],

        webpack: {
            mode: 'development',
            module: {
                rules: [
                    {
                        test: /\.ts?$/,
                        use: {
                            loader: 'ts-loader',
                            options: {
                                compilerOptions: {
                                    declaration: false,
                                    declarationMap: false
                                }
                            }
                        }
                    }
                ]
            },
            plugins: [
                new DefinePlugin({
                    'process.env': {
                        CI: JSON.stringify(true)
                    }
                })
            ],
            resolve: {
                extensions: ['.js', '.ts'],
                fallback: { util: false }
            }
        },

        webpackMiddleware: {
            noInfo: true
        }
    });

    if (env.CI) {
        config.set({
            sauceLabs: {
                recordVideo: false
            }
        });
    } else {
        const environment = require('../environment/local.json');

        config.set({
            sauceLabs: { ...environment.sauceLabs, recordVideo: false }
        });
    }
};
