import { InjectionToken } from '@angular/core';
import { INativeAudioWorkletNodeConstructor } from '../interfaces';
import { window as wndw } from './window';

export const nativeAudioWorkletNodeConstructor =
    new InjectionToken<null | INativeAudioWorkletNodeConstructor>('NATIVE_AUDIO_WORKLET_NODE_CONSTRUCTOR');

export const NATIVE_AUDIO_WORKLET_NODE_CONSTRUCTOR_PROVIDER = {
    deps: [ wndw ],
    provide: nativeAudioWorkletNodeConstructor,
    useFactory: (window: Window) => (window.hasOwnProperty('AudioWorkletNode')) ?
        (<any> window).AudioWorkletNode :
        null
};
