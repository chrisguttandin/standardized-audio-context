const { env } = require('process');
const common = require('./expectation.js');

module.exports = (config) => {

    common(config);

    config.set({

        browsers: [
            'FirefoxBrowserStack'
        ],

        captureTimeout: 120000,

        customLaunchers: {
            FirefoxBrowserStack: {
                base: 'BrowserStack',
                browser: 'firefox',
                browser_version: '69', // eslint-disable-line camelcase
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

        preprocessors: {
            'test/expectation/firefox/any/**/*.js': 'webpack',
            'test/expectation/firefox/legacy/**/*.js': 'webpack'
        }

    });

    if (env.TRAVIS) {

        config.set({

            browserStack: {
                accessKey: env.BROWSER_STACK_ACCESS_KEY,
                build: `${ env.TRAVIS_REPO_SLUG }/${ env.TRAVIS_JOB_NUMBER }/expectation-firefox-legacy`,
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
