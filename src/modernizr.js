'use strict';

require('browsernizr/test/es6/promises');
require('browsernizr/test/audio/webaudio');
require('browsernizr/test/typed-arrays');

var Modernizr = require('browsernizr');

module.exports.provider = function provider () {

    return Modernizr;

};
