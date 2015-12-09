'use strict';

import { annotate, Inject } from 'di';
import { Window } from './window.js';

function unpatchedAudioContext (window) {

    return (window.hasOwnProperty('AudioContext')) ?
        window.AudioContext :
        (window.hasOwnProperty('webkitAudioContext')) ?
            window.webkitAudioContext :
            null;

}

annotate(unpatchedAudioContext, new Inject(Window));

export { unpatchedAudioContext as UnpatchedAudioContext };
