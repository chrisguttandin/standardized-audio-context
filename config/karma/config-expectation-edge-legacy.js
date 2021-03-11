const { env } = require('process');
const { DefinePlugin } = require('webpack');

module.exports = (config) => {
    config.set({
        basePath: '../../',

        browserDisconnectTimeout: 100000,

        browserNoActivityTimeout: 100000,

        browsers: ['EdgeBrowserStack'],

        captureTimeout: 120000,

        concurrency: 1,

        customLaunchers: {
            EdgeBrowserStack: {
                base: 'BrowserStack',
                browser: 'edge',
                browser_version: '81', // eslint-disable-line camelcase
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
            browserStack: {
                accessKey: env.BROWSER_STACK_ACCESS_KEY,
                build: `${env.GITHUB_RUN_ID}/expectation-edge-legacy`,
                forceLocal: true,
                localIdentifier: `${Math.floor(Math.random() * 1000000)}`,
                project: env.GITHUB_REPOSITORY,
                username: env.BROWSER_STACK_USERNAME,
                video: false
            }
        });
    } else {
        const environment = require('../environment/local.json');

        config.set({
            browserStack: environment.browserStack
        });
    }
};
