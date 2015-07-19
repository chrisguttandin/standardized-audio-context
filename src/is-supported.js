'use strict';

require('browsernizr/test/es6/promises');
require('browsernizr/test/audio/webaudio');
require('browsernizr/test/typed-arrays');

var di = require('di'),
    Modernizr = require('browsernizr');

function provider () {

    return Modernizr.promises && Modernizr.typedarrays && Modernizr.webaudio;

}

di.annotate(provider);

module.exports.provider = provider;
