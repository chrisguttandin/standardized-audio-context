import { Inject } from '@angular/core';
import { window } from './window';

export function unpatchedOfflineAudioContextConstructor (window) {
    return (window.hasOwnProperty('OfflineAudioContext')) ?
        window.OfflineAudioContext :
        (window.hasOwnProperty('webkitOfflineAudioContext')) ?
            window.webkitOfflineAudioContext :
            null;
}

unpatchedOfflineAudioContextConstructor.parameters = [ [ new Inject(window) ] ];
