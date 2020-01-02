const { env } = require('process');
const common = require('./expectation.js');

module.exports = (config) => {

    common(config);

    config.set({

        browsers: [
            'SafariBrowserStack'
        ],

        captureTimeout: 120000,

        customLaunchers: {
            SafariBrowserStack: {
                base: 'BrowserStack',
                browser: 'Safari',
                os: 'OS X',
                os_version: 'Mojave', // eslint-disable-line camelcase
                version: '12.1'
            }
        },

        files: [
            'test/expectation/safari/any/**/*.js',
            {
                included: false,
                pattern: 'test/fixtures/**',
                served: true
            }
        ],

        preprocessors: {
            'test/expectation/safari/any/**/*.js': 'webpack'
        }

    });

    if (env.TRAVIS) {

        config.set({

            browserStack: {
                accessKey: env.BROWSER_STACK_ACCESS_KEY,
                build: `${ env.TRAVIS_REPO_SLUG }/${ env.TRAVIS_JOB_NUMBER }/expectation-safari-legacy`,
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
