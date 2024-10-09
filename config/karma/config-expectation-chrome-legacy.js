const { env } = require('process');
const { DefinePlugin } = require('webpack');

module.exports = (config) => {
    config.set({
        basePath: '../../',

        browserDisconnectTimeout: 100000,

        browserNoActivityTimeout: 100000,

        browsers: ['ChromeBrowserStack'],

        client: {
            mocha: {
                bail: true,
                timeout: 20000
            }
        },

        concurrency: 1,

        customLaunchers: {
            ChromeBrowserStack: {
                base: 'BrowserStack',
                browser: 'chrome',
                browser_version: '102', // eslint-disable-line camelcase
                os: 'Windows',
                os_version: '10' // eslint-disable-line camelcase
            }
        },

        files: [
            {
                included: false,
                pattern: 'test/fixtures/**',
                served: true,
                watched: true
            },
            'test/expectation/chrome/any/**/*.js',
            'test/expectation/chrome/legacy/**/*.js'
        ],

        frameworks: ['mocha', 'sinon-chai'],

        mime: {
            'application/javascript': ['xs']
        },

        preprocessors: {
            'test/expectation/chrome/any/**/*.js': 'webpack',
            'test/expectation/chrome/legacy/**/*.js': 'webpack'
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
            browserStack: {
                accessKey: env.BROWSER_STACK_ACCESS_KEY,
                build: `${env.GITHUB_RUN_ID}/expectation-chrome-legacy`,
                forceLocal: true,
                localIdentifier: `${Math.floor(Math.random() * 1000000)}`,
                project: env.GITHUB_REPOSITORY,
                username: env.BROWSER_STACK_USERNAME,
                video: false
            },

            captureTimeout: 300000
        });
    } else {
        const environment = require('../environment/local.json');

        config.set({
            browserStack: environment.browserStack
        });
    }
};
