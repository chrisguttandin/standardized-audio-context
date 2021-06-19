const { env } = require('process');
const { DefinePlugin } = require('webpack');

module.exports = (config) => {
    config.set({
        basePath: '../../',

        browserDisconnectTimeout: 100000,

        browserNoActivityTimeout: 100000,

        browsers:
            env.TARGET === 'chrome'
                ? ['ChromeSauceLabs']
                : env.TARGET === 'edge'
                ? ['EdgeSauceLabs']
                : env.TARGET === 'firefox'
                ? ['FirefoxSauceLabs']
                : env.TARGET === 'safari'
                ? ['SafariSauceLabs']
                : ['ChromeSauceLabs', 'EdgeSauceLabs', 'FirefoxSauceLabs', 'OperaSauceLabs', 'SafariSauceLabs'],

        concurrency: 1,

        customLaunchers: {
            ChromeSauceLabs: {
                base: 'SauceLabs',
                browserName: 'chrome',
                captureTimeout: 300,
                platform: 'macOS 11.00',
                version: '80.0'
            },
            EdgeSauceLabs: {
                base: 'SauceLabs',
                browserName: 'MicrosoftEdge',
                captureTimeout: 300,
                platform: 'macOS 11.00',
                version: '80.0'
            },
            FirefoxSauceLabs: {
                base: 'SauceLabs',
                browserName: 'firefox',
                captureTimeout: 300,
                platform: 'macOS 11.00',
                version: '69.0'
            },
            SafariSauceLabs: {
                base: 'SauceLabs',
                browserName: 'safari',
                captureTimeout: 300,
                platform: 'macOS 10.13',
                version: '11.1'
            }
        },

        files: [
            {
                included: false,
                pattern: 'src/**',
                served: false,
                watched: true
            },
            {
                included: false,
                pattern: 'test/fixtures/**',
                served: true,
                watched: true
            },
            'test/integration/**/*.js'
        ],

        frameworks: ['mocha', 'sinon-chai'],

        preprocessors: {
            'test/integration/**/*.js': 'webpack'
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
                        CI: JSON.stringify(env.CI)
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
