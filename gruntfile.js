const loadGruntConfig = require('load-grunt-config');
const { join } = require('path');
const { cwd } = require('process');

module.exports = (grunt) => loadGruntConfig(grunt, { configPath: join(cwd(), 'config/grunt') });
