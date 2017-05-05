import { OpaqueToken } from '@angular/core';
import { window as windowToken } from './window';

export const unpatchedOfflineAudioContextConstructor = new OpaqueToken('UNPATCHED_OFFLINE_AUDIO_CONTEXT_CONSTRUCTOR');

export const UNPATCHED_OFFLINE_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER = {
    deps: [ windowToken ],
    provide: unpatchedOfflineAudioContextConstructor,
    useFactory: (window: any) => (window.hasOwnProperty('OfflineAudioContext')) ?
        window.OfflineAudioContext :
        (window.hasOwnProperty('webkitOfflineAudioContext')) ?
            window.webkitOfflineAudioContext :
            null
};
