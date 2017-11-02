import { InjectionToken } from '@angular/core';
import { IUnpatchedAudioContextConstructor } from '../interfaces';
import { window as wndw } from './window';

export const unpatchedAudioContextConstructor =
    new InjectionToken<null | IUnpatchedAudioContextConstructor>('UNPATCHED_AUDIO_CONTEXT_CONSTRUCTOR');

export const UNPATCHED_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER = {
    deps: [ wndw ],
    provide: unpatchedAudioContextConstructor,
    useFactory: (window: Window) => (window.hasOwnProperty('AudioContext')) ?
        (<any> window).AudioContext :
        (window.hasOwnProperty('webkitAudioContext')) ?
            (<any> window).webkitAudioContext :
            null
};
