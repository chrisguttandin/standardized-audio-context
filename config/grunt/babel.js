const babelOptions = require('../babel/build.json');

module.exports = {
    build: {
        files: [ {
            cwd: 'build/es2019',
            dest: 'build/node',
            expand: true,
            src: [
                '**/*.js'
            ]
        } ],
        options: babelOptions
    }
};
