import { Inject } from 'angular2/core';
import { window } from './window.js';

export function unpatchedOfflineAudioContextConstructor (window) {

    return (window.hasOwnProperty('OfflineAudioContext')) ?
        window.OfflineAudioContext :
        (window.hasOwnProperty('webkitOfflineAudioContext')) ?
            window.webkitOfflineAudioContext :
            null;

}

unpatchedOfflineAudioContextConstructor.parameters = [ [ new Inject(window) ] ];
