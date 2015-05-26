'use strict';

var di = require('di'),
    windowProvider = require('./window.js').provider;

function provider (window) {

    return (window.hasOwnProperty('AudioContext')) ?
        window.AudioContext :
        (window.hasOwnProperty('webkitAudioContext')) ?
            window.webkitAudioContext :
            null;

}

di.annotate(provider, new di.Inject(windowProvider));

module.exports.provider = provider;
