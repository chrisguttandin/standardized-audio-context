'use strict';

var audioContextProvider = require('./audio-context.js').provider,
    di = require('di'),
    injector,
    isSupportedProvider = require('./is-supported.js').provider;

injector = new di.Injector();

module.exports = {

    AudioContext: injector.get(audioContextProvider),

    isSupported: injector.get(isSupportedProvider)

};
