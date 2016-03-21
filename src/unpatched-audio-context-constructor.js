import { Inject } from 'angular2/src/core/di/decorators';
import { window } from './window.js';

export function unpatchedAudioContextConstructor (window) {
    return (window.hasOwnProperty('AudioContext')) ?
        window.AudioContext :
        (window.hasOwnProperty('webkitAudioContext')) ?
            window.webkitAudioContext :
            null;
}

unpatchedAudioContextConstructor.parameters = [ [ new Inject(window) ] ];
