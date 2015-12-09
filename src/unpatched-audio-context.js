'use strict';

var di = require('di'),
    Window = require('./window.js').Window;

function unpatchedAudioContext (window) {

    return (window.hasOwnProperty('AudioContext')) ?
        window.AudioContext :
        (window.hasOwnProperty('webkitAudioContext')) ?
            window.webkitAudioContext :
            null;

}

di.annotate(unpatchedAudioContext, new di.Inject(Window));

module.exports.UnpatchedAudioContext = unpatchedAudioContext;
