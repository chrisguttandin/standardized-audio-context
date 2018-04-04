import {
    IAudioContextConstructor,
    IBaseAudioContextConstructor,
    IMediaElementAudioSourceNodeConstructor,
    IMediaStreamAudioSourceNodeConstructor,
    INativeAudioContextConstructor
} from '../interfaces';
import { TInvalidStateErrorFactory } from './invalid-state-error-factory';

export type TAudioContextConstructorFactory = (
    baseAudioContextConstructor: IBaseAudioContextConstructor,
    createInvalidStateError: TInvalidStateErrorFactory,
    mediaElementAudioSourceNodeConstructor: IMediaElementAudioSourceNodeConstructor,
    mediaStreamAudioSourceNodeConstructor: IMediaStreamAudioSourceNodeConstructor,
    nativeAudioContextConstructor: null | INativeAudioContextConstructor
) => IAudioContextConstructor;
