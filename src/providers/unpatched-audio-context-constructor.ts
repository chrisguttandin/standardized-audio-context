import { OpaqueToken } from '@angular/core';
import { window as windowToken } from './window';

export const unpatchedAudioContextConstructor = new OpaqueToken('UNPATCHED_AUDIO_CONTEXT_CONSTRUCTOR');

export const UNPATCHED_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER = {
    deps: [ windowToken ],
    provide: unpatchedAudioContextConstructor,
    useFactory: (window: any) => (window.hasOwnProperty('AudioContext')) ?
        window.AudioContext :
        (window.hasOwnProperty('webkitAudioContext')) ?
            window.webkitAudioContext :
            null
};
