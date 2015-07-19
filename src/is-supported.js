'use strict';

var di = require('di'),
    modernizrProvider = require('./modernizr.js').provider;

function provider (Modernizr) {

    return Modernizr.promises && Modernizr.typedarrays && Modernizr.webaudio;

}

di.annotate(provider, new di.Inject(modernizrProvider));

module.exports.provider = provider;
