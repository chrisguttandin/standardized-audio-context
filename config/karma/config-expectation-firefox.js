const { env } = require('process');

module.exports = (config) => {
    config.set({
        basePath: '../../',

        browserNoActivityTimeout: 240000,

        files: [
            'test/expectation/firefox/any/**/*.js',
            'test/expectation/firefox/current/**/*.js',
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
            'test/expectation/firefox/any/**/*.js': 'webpack',
            'test/expectation/firefox/current/**/*.js': 'webpack'
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
                build: `${env.TRAVIS_REPO_SLUG}/${env.TRAVIS_JOB_NUMBER}/expectation-firefox`,
                username: env.BROWSER_STACK_USERNAME,
                video: false
            },

            browsers: ['FirefoxBrowserStack'],

            captureTimeout: 120000,

            customLaunchers: {
                FirefoxBrowserStack: {
                    base: 'BrowserStack',
                    browser: 'firefox',
                    os: 'Windows',
                    os_version: '10' // eslint-disable-line camelcase
                }
            }
        });
    } else {
        config.set({
            browsers: ['FirefoxHeadless']
        });
    }
};
