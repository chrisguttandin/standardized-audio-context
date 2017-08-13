import { InjectionToken } from '@angular/core';
import { window as wndw } from './window';

export const unpatchedAudioContextConstructor = new InjectionToken<Promise<null | AudioContext>>('UNPATCHED_AUDIO_CONTEXT_CONSTRUCTOR');

export const UNPATCHED_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER = {
    deps: [ wndw ],
    provide: unpatchedAudioContextConstructor,
    useFactory: (window: Window) => (window.hasOwnProperty('AudioContext')) ?
        (<any> window).AudioContext :
        (window.hasOwnProperty('webkitAudioContext')) ?
            (<any> window).webkitAudioContext :
            null
};
