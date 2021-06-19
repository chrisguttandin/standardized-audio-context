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
            browsers:
                env.TARGET === 'chrome'
                    ? ['ChromeSauceLabs']
                    : env.TARGET === 'firefox'
                    ? ['FirefoxSauceLabs']
                    : ['ChromeSauceLabs', 'FirefoxSauceLabs'],

            customLaunchers: {
                ChromeSauceLabs: {
                    'base': 'SauceLabs',
                    'browserName': 'chrome',
                    'captureTimeout': 300,
                    'goog:chromeOptions': {
                        args: ['--autoplay-policy=no-user-gesture-required']
                    },
                    'platform': 'macOS 11.00'
                },
                FirefoxSauceLabs: {
                    'base': 'SauceLabs',
                    'browserName': 'firefox',
                    'captureTimeout': 300,
                    'moz:firefoxOptions': {
                        prefs: {
                            'media.autoplay.default': 0,
                            'media.navigator.permission.disabled': true,
                            'media.navigator.streams.fake': true
                        }
                    },
                    'platform': 'macOS 11.00'
                }
            },

            sauceLabs: {
                recordVideo: false
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
                'OperaWithNoRequiredUserGestureAndNoThrottling',
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
                },
                OperaWithNoRequiredUserGestureAndNoThrottling: {
                    base: 'Opera',
                    flags: [
                        '--autoplay-policy=no-user-gesture-required',
                        '--disable-background-timer-throttling',
                        '--disable-renderer-backgrounding'
                    ]
                }
            }
        });

        env.CHROMIUM_BIN = '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge';
    }
};
