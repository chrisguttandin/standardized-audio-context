'use strict';

require('browsernizr/test/es6/promises');
require('browsernizr/test/audio/webaudio');
require('browsernizr/test/typed-arrays');

var di = require('di'),
    modernizr = require('browsernizr');

function Modernizr () {

    return modernizr;

}

di.annotate(Modernizr);

module.exports.Modernizr = Modernizr;
