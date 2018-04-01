import {
    IMinimalBaseAudioContextConstructor,
    IMinimalOfflineAudioContextConstructor,
    IUnpatchedOfflineAudioContextConstructor
} from '../interfaces';

export type TMinimalOfflineAudioContextConstructorFactory = (
    minimalBaseAudioContextConstructor: IMinimalBaseAudioContextConstructor,
    unpatchedOfflineAudioContextConstructor: null | IUnpatchedOfflineAudioContextConstructor
) => IMinimalOfflineAudioContextConstructor;
