import { Inject } from '@angular/core/src/di/decorators';
import { window } from './window';

export function unpatchedAudioContextConstructor (window) {
    return (window.hasOwnProperty('AudioContext')) ?
        window.AudioContext :
        (window.hasOwnProperty('webkitAudioContext')) ?
            window.webkitAudioContext :
            null;
}

unpatchedAudioContextConstructor.parameters = [ [ new Inject(window) ] ];
