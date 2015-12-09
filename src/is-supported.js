'use strict';

var di = require('di'),
    Modernizr = require('./modernizr.js').Modernizr;

function provider (modernizr) {

    return modernizr.promises && modernizr.typedarrays && modernizr.webaudio;

}

di.annotate(provider, new di.Inject(Modernizr));

module.exports.provider = provider;
