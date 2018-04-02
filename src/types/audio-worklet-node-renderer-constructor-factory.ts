import {
    IAudioWorkletNodeRendererConstructor,
    INativeAudioWorkletNodeConstructor,
    IUnpatchedOfflineAudioContextConstructor
} from '../interfaces';

export type TAudioWorkletNodeRendererConstructorFactory = (
    nativeAudioWorkletNodeConstructor: null | INativeAudioWorkletNodeConstructor,
    unpatchedOfflineAudioContextConstructor: null | IUnpatchedOfflineAudioContextConstructor
) => IAudioWorkletNodeRendererConstructor;
