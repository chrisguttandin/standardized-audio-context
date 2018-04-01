import { IBaseAudioContextConstructor, IOfflineAudioContextConstructor, IUnpatchedOfflineAudioContextConstructor } from '../interfaces';

export type TOfflineAudioContextConstructorFactory = (
    baseAudioContextConstructor: IBaseAudioContextConstructor,
    unpatchedOfflineAudioContextConstructor: null | IUnpatchedOfflineAudioContextConstructor
) => IOfflineAudioContextConstructor;
