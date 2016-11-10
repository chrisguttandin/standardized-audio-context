import { Window } from './window';
import { OpaqueToken } from '@angular/core';

export const unpatchedOfflineAudioContextConstructor = new OpaqueToken('UNPATCHED_OFFLINE_AUDIO_CONTEXT_CONSTRUCTOR');

export const UNPATCHED_OFFLINE_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER = {
    deps: [ Window ],
    provide: unpatchedOfflineAudioContextConstructor,
    useFactory: (window) => (window.hasOwnProperty('OfflineAudioContext')) ?
        window.OfflineAudioContext :
        (window.hasOwnProperty('webkitOfflineAudioContext')) ?
            window.webkitOfflineAudioContext :
            null
};
