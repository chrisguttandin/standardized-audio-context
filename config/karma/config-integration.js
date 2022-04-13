const { env } = require('process');
const { DefinePlugin } = require('webpack');

module.exports = (config) => {
    config.set({
        basePath: '../../',

        browserDisconnectTimeout: 100000,

        browserNoActivityTimeout: 100000,

        browsers:
            env.TARGET === 'chrome'
                ? ['ChromeBrowserStack']
                : env.TARGET === 'edge'
                ? ['EdgeBrowserStack']
                : env.TARGET === 'firefox'
                ? ['FirefoxBrowserStack']
                : env.TARGET === 'safari'
                ? ['SafariBrowserStack']
                : ['ChromeBrowserStack', 'EdgeBrowserStack', 'FirefoxBrowserStack', 'SafariBrowserStack'],

        concurrency: 1,

        customLaunchers: {
            ChromeBrowserStack: {
                base: 'BrowserStack',
                browser: 'chrome',
                browser_version: '80', // eslint-disable-line camelcase
                os: 'OS X',
                os_version: 'High Sierra' // eslint-disable-line camelcase
            },
            EdgeBrowserStack: {
                base: 'BrowserStack',
                browser: 'edge',
                browser_version: '80', // eslint-disable-line camelcase
                os: 'Windows',
                os_version: '10' // eslint-disable-line camelcase
            },
            FirefoxBrowserStack: {
                base: 'BrowserStack',
                browser: 'firefox',
                browser_version: '69', // eslint-disable-line camelcase
                os: 'Windows',
                os_version: '10' // eslint-disable-line camelcase
            },
            SafariBrowserStack: {
                base: 'BrowserStack',
                browser: 'safari',
                browser_version: '11.1', // eslint-disable-line camelcase
                os: 'OS X',
                os_version: 'High Sierra' // eslint-disable-line camelcase
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
            browserStack: {
                accessKey: env.BROWSER_STACK_ACCESS_KEY,
                build: `${env.GITHUB_RUN_ID}/integration-${env.TARGET}`,
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
