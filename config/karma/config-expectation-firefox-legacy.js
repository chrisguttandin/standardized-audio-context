const { env } = require('process');

module.exports = (config) => {
    config.set({
        basePath: '../../',

        browserNoActivityTimeout: 240000,

        browsers: ['FirefoxBrowserStack'],

        captureTimeout: 120000,

        customLaunchers: {
            FirefoxBrowserStack: {
                base: 'BrowserStack',
                browser: 'firefox',
                browser_version: '70', // eslint-disable-line camelcase
                os: 'Windows',
                os_version: '10' // eslint-disable-line camelcase
            }
        },

        files: [
            'test/expectation/firefox/any/**/*.js',
            'test/expectation/firefox/legacy/**/*.js',
            {
                included: false,
                pattern: 'test/fixtures/**',
                served: true
            }
        ],

        frameworks: ['mocha', 'sinon-chai'],

        preprocessors: {
            'test/expectation/firefox/any/**/*.js': 'webpack',
            'test/expectation/firefox/legacy/**/*.js': 'webpack'
        },

        webpack: {
            mode: 'development',
            module: {
                rules: [
                    {
                        test: /\.ts?$/,
                        use: {
                            loader: 'ts-loader'
                        }
                    }
                ]
            },
            resolve: {
                extensions: ['.js', '.ts']
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
                build: `${env.TRAVIS_REPO_SLUG}/${env.TRAVIS_JOB_NUMBER}/expectation-firefox-legacy`,
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
