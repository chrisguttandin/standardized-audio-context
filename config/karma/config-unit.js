const { env } = require('process');
const { DefinePlugin } = require('webpack');

module.exports = (config) => {
    config.set({
        basePath: '../../',

        browserDisconnectTimeout: 100000,

        browserNoActivityTimeout: 100000,

        concurrency: 1,

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
            'test/unit/**/*.js'
        ],

        frameworks: ['mocha', 'sinon-chai'],

        mime: {
            'application/javascript': ['xs']
        },

        preprocessors: {
            'test/unit/**/*.js': 'webpack'
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
                build: `${env.GITHUB_RUN_ID}/unit-${env.TARGET}`,
                forceLocal: true,
                localIdentifier: `${Math.floor(Math.random() * 1000000)}`,
                project: env.GITHUB_REPOSITORY,
                username: env.BROWSER_STACK_USERNAME,
                video: false
            },

            /*
             * @todo There is currently no way to disable the autoplay policy on BrowserStack or Sauce Labs.
             * 'ChromeBrowserStack',
             */
            browsers:
                env.TARGET === 'edge'
                    ? ['EdgeBrowserStack']
                    : env.TARGET === 'firefox'
                    ? ['FirefoxBrowserStack']
                    : ['EdgeBrowserStack', 'FirefoxBrowserStack'],

            customLaunchers: {
                ChromeBrowserStack: {
                    base: 'BrowserStack',
                    browser: 'chrome',
                    os: 'Windows',
                    os_version: '10', // eslint-disable-line camelcase
                    timeout: 1800
                },
                EdgeBrowserStack: {
                    base: 'BrowserStack',
                    browser: 'edge',
                    os: 'Windows',
                    os_version: '10', // eslint-disable-line camelcase
                    timeout: 1800
                },
                FirefoxBrowserStack: {
                    base: 'BrowserStack',
                    browser: 'firefox',
                    os: 'Windows',
                    os_version: '10', // eslint-disable-line camelcase
                    timeout: 1800
                }
            }
        });
    } else {
        config.set({
            browsers: [
                'ChromeCanaryHeadlessWithNoRequiredUserGesture',
                'ChromeHeadlessWithNoRequiredUserGesture',
                'Edge',
                'FirefoxDeveloperHeadlessWithPrefs',
                'FirefoxHeadlessWithPrefs',
                'Safari'
            ],

            concurrency: 1,

            customLaunchers: {
                ChromeCanaryHeadlessWithNoRequiredUserGesture: {
                    base: 'ChromeCanaryHeadless',
                    flags: ['--autoplay-policy=no-user-gesture-required']
                },
                ChromeHeadlessWithNoRequiredUserGesture: {
                    base: 'ChromeHeadless',
                    flags: ['--autoplay-policy=no-user-gesture-required']
                },
                Edge: {
                    base: 'ChromiumHeadless'
                },
                FirefoxDeveloperHeadlessWithPrefs: {
                    base: 'FirefoxDeveloperHeadless',
                    prefs: {
                        'media.autoplay.default': 0,
                        'media.navigator.permission.disabled': true,
                        'media.navigator.streams.fake': true
                    }
                },
                FirefoxHeadlessWithPrefs: {
                    base: 'FirefoxHeadless',
                    prefs: {
                        'media.autoplay.default': 0,
                        'media.navigator.permission.disabled': true,
                        'media.navigator.streams.fake': true
                    }
                }
            }
        });

        env.CHROMIUM_BIN = '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge';
    }
};
