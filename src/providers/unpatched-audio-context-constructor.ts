import { Window } from './window';
import { OpaqueToken } from '@angular/core';

export const unpatchedAudioContextConstructor = new OpaqueToken('UNPATCHED_AUDIO_CONTEXT_CONSTRUCTOR');

export const UNPATCHED_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER = {
    deps: [ Window ],
    provide: unpatchedAudioContextConstructor,
    useFactory: (window) => (window.hasOwnProperty('AudioContext')) ?
        window.AudioContext :
        (window.hasOwnProperty('webkitAudioContext')) ?
            window.webkitAudioContext :
            null
};
