module.exports = (grunt) => {
    const fix = (grunt.option('fix') === true);

    return {
        config: {
            options: {
                configFile: 'config/eslint/config.json',
                fix,
                reportUnusedDisableDirectives: true
            },
            src: [ '*.js', 'config/**/*.js' ]
        },
        src: {
            options: {
                configFile: 'config/eslint/src.json',
                fix,
                reportUnusedDisableDirectives: true
            },
            src: [ 'src/**/*.js' ]
        },
        test: {
            options: {
                configFile: 'config/eslint/test.json',
                fix,
                reportUnusedDisableDirectives: true
            },
            src: [ 'test/**/*.js' ]
        }
    };
};
