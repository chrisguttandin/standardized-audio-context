module.exports = (config) => {

    config.set({

        basePath: '../../',

        browserNoActivityTimeout: 240000,

        client: {
            mocha: {
                bail: true
            }
        },

        concurrency: 2,

        files: [
            {
                included: false,
                pattern: 'src/**',
                served: false
            }, {
                included: false,
                pattern: 'test/fixtures/**',
                served: true
            },
            'test/unit/**/*.js'
        ],

        frameworks: [
            'mocha',
            'sinon-chai'
        ],

        preprocessors: {
            'test/unit/**/*.js': 'webpack'
        },

        singleRun: true,

        webpack: {
            mode: 'development',
            module: {
                rules: [ {
                    test: /\.ts?$/,
                    use: {
                        loader: 'ts-loader'
                    }
                } ]
            },
            resolve: {
                extensions: [ '.js', '.ts' ]
            }
        },

        webpackMiddleware: {
            noInfo: true
        }

    });

    if (process.env.TRAVIS) {

        config.set({

            browserStack: {
                accessKey: process.env.BROWSER_STACK_ACCESS_KEY,
                username: process.env.BROWSER_STACK_USERNAME
            },

            browsers: [
                'ChromeSauceLabs',
                'EdgeBrowserStack',
                'FirefoxBrowserStack'
                /*
                 * @todo Enable Safari tests again.
                 * 'SafariBrowserStack'
                 */
            ],

            captureTimeout: 120000,

            customLaunchers: {
                ChromeSauceLabs: {
                    base: 'SauceLabs',
                    browserName: 'chrome',
                    platform: 'OS X 10.11'
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
                    os_version: 'Sierra' // eslint-disable-line camelcase
                },
                SafariBrowserStack: {
                    base: 'BrowserStack',
                    browser: 'safari',
                    os: 'OS X',
                    os_version: 'Sierra' // eslint-disable-line camelcase
                }
            },

            tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER

        });

    } else {

        const environment = require('../environment/local.json');

        config.set({

            browserStack: environment.browserStack,

            browsers: [
                'ChromeCanaryHeadlessWithNoRequiredUserGesture',
                'ChromeHeadlessWithNoRequiredUserGesture',
                'EdgeBrowserStack',
                'FirefoxDeveloperHeadless',
                'FirefoxHeadless',
                'Opera',
                'Safari'
            ],

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
                }
            }

        });

    }

};
