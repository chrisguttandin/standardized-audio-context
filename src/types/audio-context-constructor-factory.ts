import {
    IAudioContextConstructor,
    IBaseAudioContextConstructor,
    IMediaElementAudioSourceNodeConstructor,
    IMediaStreamAudioSourceNodeConstructor,
    IUnpatchedAudioContextConstructor
} from '../interfaces';
import { TInvalidStateErrorFactory } from './invalid-state-error-factory';

export type TAudioContextConstructorFactory = (
    baseAudioContextConstructor: IBaseAudioContextConstructor,
    createInvalidStateError: TInvalidStateErrorFactory,
    mediaElementAudioSourceNodeConstructor: IMediaElementAudioSourceNodeConstructor,
    mediaStreamAudioSourceNodeConstructor: IMediaStreamAudioSourceNodeConstructor,
    unpatchedAudioContextConstructor: null | IUnpatchedAudioContextConstructor
) => IAudioContextConstructor;
