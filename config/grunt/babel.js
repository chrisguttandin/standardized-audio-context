const babelOptions = require('../babel/build.json');

module.exports = {
    build: {
        files: [ {
            cwd: 'build/es2018',
            dest: 'build/node',
            expand: true,
            src: [
                '**/*.js'
            ]
        } ],
        options: babelOptions
    }
};
