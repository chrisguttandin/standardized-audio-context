const { env } = require('process');
const { DefinePlugin } = require('webpack');

module.exports = (config) => {

    config.set({

        basePath: '../../',

        browserDisconnectTimeout: 20000,

        browserNoActivityTimeout: 240000,

        files: [
            {
                included: false,
                pattern: 'src/**',
                served: false
            },
            {
                included: false,
                pattern: 'test/fixtures/**',
                served: true
            },
            'test/unit/**/*.js'
        ],

        frameworks: [
            'parallel',
            'mocha',
            'sinon-chai'
        ],

        parallelOptions: {
            executors: 7
        },

        preprocessors: {
            'test/unit/**/*.js': 'webpack'
        },

        reporters: [
            'dots'
        ],

        singleRun: true,

        webpack: {
            mode: 'development',
            module: {
                rules: [ {
                    test: /\.ts?$/,
                    use: {
                        loader: 'ts-loader',
                        options: {
                            compilerOptions: {
                                // @todo This is necessary to run the tests in Edge v18.
                                target: 'es2017'
                            }
                        }
                    }
                } ]
            },
            plugins: [
                new DefinePlugin({
                    'process.env': {
                        TRAVIS: JSON.stringify(env.TRAVIS)
                    }
                })
            ],
            resolve: {
                extensions: [ '.js', '.ts' ]
            }
        },

        webpackMiddleware: {
            noInfo: true
        }

    });

    if (env.TRAVIS) {

        config.set({

            browserStack: {
                accessKey: env.BROWSER_STACK_ACCESS_KEY,
                username: env.BROWSER_STACK_USERNAME
            },

            browsers: [
                /*
                 * @todo There is currently no way to disable the autoplay policy on BrowserStack or Sauce Labs.
                 * 'ChromeBrowserStack',
                 */
                'EdgeBrowserStack',
                'FirefoxBrowserStack'
            ],

            captureTimeout: 120000,

            customLaunchers: {
                ChromeBrowserStack: {
                    base: 'BrowserStack',
                    browser: 'chrome',
                    os: 'Windows',
                    os_version: '10' // eslint-disable-line camelcase
                },
                EdgeBrowserStack: {
                    base: 'BrowserStack',
                    browser: 'edge',
                    os: 'Windows',
                    os_version: '10' // eslint-disable-line camelcase
                },
                FirefoxBrowserStack: {
                    base: 'BrowserStack',
                    browser: 'firefox',
                    os: 'OS X',
                    os_version: 'Mojave' // eslint-disable-line camelcase
                }
            },

            tunnelIdentifier: env.TRAVIS_JOB_NUMBER

        });

    } else {

        const environment = require('../environment/local.json');

        config.set({

            browserStack: environment.browserStack,

            browsers: [
                'ChromeCanaryHeadlessWithNoRequiredUserGesture',
                'ChromeHeadlessWithNoRequiredUserGesture',
                'EdgeBrowserStack',
                'FirefoxDeveloperHeadlessWithPrefs',
                'FirefoxHeadlessWithPrefs',
                'OperaWithNoRequiredUserGestureAndNoThrottling',
                'Safari'
            ],

            concurrency: 1,

            customLaunchers: {
                ChromeCanaryHeadlessWithNoRequiredUserGesture: {
                    base: 'ChromeCanaryHeadless',
                    flags: [ '--autoplay-policy=no-user-gesture-required' ]
                },
                ChromeHeadlessWithNoRequiredUserGesture: {
                    base: 'ChromeHeadless',
                    flags: [ '--autoplay-policy=no-user-gesture-required' ]
                },
                EdgeBrowserStack: {
                    base: 'BrowserStack',
                    browser: 'edge',
                    os: 'Windows',
                    os_version: '10' // eslint-disable-line camelcase
                },
                FirefoxDeveloperHeadlessWithPrefs: {
                    base : 'FirefoxDeveloperHeadless',
                    prefs : {
                        'media.autoplay.default': 0,
                        'media.navigator.permission.disabled' : true,
                        'media.navigator.streams.fake': true
                    }
                },
                FirefoxHeadlessWithPrefs: {
                    base : 'FirefoxHeadless',
                    prefs : {
                        'media.navigator.permission.disabled' : true,
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

    }

};
