const { env } = require('process');

module.exports = (config) => {
    config.set({
        basePath: '../../',

        browserNoActivityTimeout: 240000,

        captureTimeout: 120000,

        files: [
            'test/expectation/edge/any/**/*.js',
            'test/expectation/edge/current/**/*.js',
            {
                included: false,
                pattern: 'test/fixtures/**',
                served: true
            }
        ],

        frameworks: ['mocha', 'sinon-chai'],

        mime: {
            'application/javascript': ['xs']
        },

        preprocessors: {
            'test/expectation/edge/any/**/*.js': 'webpack',
            'test/expectation/edge/current/**/*.js': 'webpack'
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
                build: `${env.TRAVIS_REPO_SLUG}/${env.TRAVIS_JOB_NUMBER}/expectation-edge`,
                username: env.BROWSER_STACK_USERNAME,
                video: false
            },

            browsers: ['EdgeBrowserStack'],

            customLaunchers: {
                EdgeBrowserStack: {
                    base: 'BrowserStack',
                    browser: 'edge',
                    os: 'Windows',
                    os_version: '10' // eslint-disable-line camelcase
                }
            }
        });
    } else {
        config.set({
            browsers: ['Edge'],

            customLaunchers: {
                Edge: {
                    base: 'ChromiumHeadless'
                }
            }
        });

        env.CHROMIUM_BIN = '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge';
    }
};
