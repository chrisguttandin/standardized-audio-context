const loadGruntConfig = require('load-grunt-config');
const { cwd } = require('process');

module.exports = (grunt) => {

    loadGruntConfig(grunt, {
        configPath: cwd() + '/config/grunt'
    });

    grunt.loadNpmTasks('gruntify-eslint');

};
