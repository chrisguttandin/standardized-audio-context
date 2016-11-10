const loadGruntConfig = require('load-grunt-config');

module.exports = function (grunt) {

    loadGruntConfig(grunt, {
        configPath: process.cwd() + '/config/grunt'
    });

    grunt.loadNpmTasks('gruntify-eslint');

};
