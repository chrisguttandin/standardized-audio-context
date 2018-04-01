import { IAudioContextConstructor, IBaseAudioContextConstructor, IUnpatchedAudioContextConstructor } from '../interfaces';

export type TAudioContextConstructorFactory = (
    baseAudioContextConstructor: IBaseAudioContextConstructor,
    unpatchedAudioContextConstructor: null | IUnpatchedAudioContextConstructor
) => IAudioContextConstructor;
