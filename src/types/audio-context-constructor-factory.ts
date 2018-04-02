import {
    IAudioContextConstructor,
    IBaseAudioContextConstructor,
    IMediaElementAudioSourceNodeConstructor,
    IMediaStreamAudioSourceNodeConstructor,
    IUnpatchedAudioContextConstructor
} from '../interfaces';

export type TAudioContextConstructorFactory = (
    baseAudioContextConstructor: IBaseAudioContextConstructor,
    mediaElementAudioSourceNodeConstructor: IMediaElementAudioSourceNodeConstructor,
    mediaStreamAudioSourceNodeConstructor: IMediaStreamAudioSourceNodeConstructor,
    unpatchedAudioContextConstructor: null | IUnpatchedAudioContextConstructor
) => IAudioContextConstructor;
