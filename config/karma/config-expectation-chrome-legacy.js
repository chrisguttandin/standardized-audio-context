const { env } = require('process');
const { DefinePlugin } = require('webpack');

module.exports = (config) => {
    config.set({
        basePath: '../../',

        browserNoActivityTimeout: 240000,

        browsers: ['ChromeBrowserStack'],

        captureTimeout: 120000,

        customLaunchers: {
            ChromeBrowserStack: {
                base: 'BrowserStack',
                browser: 'chrome',
                browser_version: '81', // eslint-disable-line camelcase
                os: 'Windows',
                os_version: '10' // eslint-disable-line camelcase
            }
        },

        files: [
            'test/expectation/chrome/any/**/*.js',
            'test/expectation/chrome/legacy/**/*.js',
            {
                included: false,
                pattern: 'test/fixtures/**',
                served: true
            }
        ],

        frameworks: ['mocha', 'sinon-chai'],

        preprocessors: {
            'test/expectation/chrome/any/**/*.js': 'webpack',
            'test/expectation/chrome/legacy/**/*.js': 'webpack'
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
            plugins: [
                new DefinePlugin({
                    'process.env': {
                        TRAVIS: JSON.stringify(true)
                    }
                })
            ],
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
                build: `${env.TRAVIS_REPO_SLUG}/${env.TRAVIS_JOB_NUMBER}/expectation-chrome-legacy`,
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
