import { IMinimalAudioContextConstructor, IMinimalBaseAudioContextConstructor, IUnpatchedAudioContextConstructor } from '../interfaces';

export type TMinimalAudioContextConstructorFactory = (
    minimalBaseAudioContextConstructor: IMinimalBaseAudioContextConstructor,
    unpatchedAudioContextConstructor: null | IUnpatchedAudioContextConstructor
) => IMinimalAudioContextConstructor;
