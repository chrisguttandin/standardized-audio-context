import { InjectionToken } from '@angular/core';
import { IUnpatchedOfflineAudioContextConstructor } from '../interfaces';
import { window as wndw } from './window';

export const unpatchedOfflineAudioContextConstructor =
    new InjectionToken<null | IUnpatchedOfflineAudioContextConstructor>('UNPATCHED_OFFLINE_AUDIO_CONTEXT_CONSTRUCTOR');

export const UNPATCHED_OFFLINE_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER = {
    deps: [ wndw ],
    provide: unpatchedOfflineAudioContextConstructor,
    useFactory: (window: Window) => (window.hasOwnProperty('OfflineAudioContext')) ?
        (<any> window).OfflineAudioContext :
        (window.hasOwnProperty('webkitOfflineAudioContext')) ?
            (<any> window).webkitOfflineAudioContext :
            null
};
