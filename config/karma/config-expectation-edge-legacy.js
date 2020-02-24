const { env } = require('process');

module.exports = (config) => {

    config.set({

        basePath: '../../',

        browserNoActivityTimeout: 240000,

        browsers: [
            'EdgeBrowserStack'
        ],

        captureTimeout: 120000,

        customLaunchers: {
            EdgeBrowserStack: {
                base: 'BrowserStack',
                browser: 'edge',
                browser_version: '18.0', // eslint-disable-line camelcase
                os: 'Windows',
                os_version: '10' // eslint-disable-line camelcase
            }
        },

        files: [
            'test/expectation/edge/any/**/*.js',
            'test/expectation/edge/legacy/**/*.js',
            {
                included: false,
                pattern: 'test/fixtures/**',
                served: true
            }
        ],

        frameworks: [
            'mocha',
            'sinon-chai'
        ],

        preprocessors: {
            'test/expectation/edge/any/**/*.js': 'webpack',
            'test/expectation/edge/legacy/**/*.js': 'webpack'
        },

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

    if (env.TRAVIS) {

        config.set({

            browserStack: {
                accessKey: env.BROWSER_STACK_ACCESS_KEY,
                build: `${ env.TRAVIS_REPO_SLUG }/${ env.TRAVIS_JOB_NUMBER }/expectation-edge-legacy`,
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
