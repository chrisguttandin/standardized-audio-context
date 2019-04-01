const { env } = require('process');

module.exports = (config) => {

    config.set({

        basePath: '../../',

        browserNoActivityTimeout: 240000,

        browsers: [
            'ChromeBrowserStack',
            'EdgeBrowserStack',
            'FirefoxBrowserStack',
            'OperaBrowserStack',
            'SafariBrowserStack'
        ],

        concurrency: 2,

        customLaunchers: {
            ChromeBrowserStack: {
                base: 'BrowserStack',
                browser: 'chrome',
                browser_version: '67.0', // eslint-disable-line camelcase
                os: 'OS X',
                os_version: 'Mojave' // eslint-disable-line camelcase
            },
            EdgeBrowserStack: {
                base: 'BrowserStack',
                browser: 'edge',
                browser_version : '17.0', // eslint-disable-line camelcase
                os: 'Windows',
                os_version: '10' // eslint-disable-line camelcase
            },
            FirefoxBrowserStack: {
                base: 'BrowserStack',
                browser: 'firefox',
                browser_version: '62', // eslint-disable-line camelcase
                os: 'OS X',
                os_version: 'Mojave' // eslint-disable-line camelcase
            },
            OperaBrowserStack: {
                base: 'BrowserStack',
                browser: 'opera',
                browser_version : '57', // eslint-disable-line camelcase
                os: 'OS X',
                os_version: 'Mojave' // eslint-disable-line camelcase
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
                served: false
            },
            'test/integration/**/*.js'
        ],

        frameworks: [
            'mocha',
            'sinon-chai'
        ],

        preprocessors: {
            'test/integration/**/*.js': 'webpack'
        },

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

            captureTimeout: 120000

        });

    } else {

        const environment = require('../environment/local.json');

        config.set({

            browserStack: environment.browserStack

        });

    }

};
