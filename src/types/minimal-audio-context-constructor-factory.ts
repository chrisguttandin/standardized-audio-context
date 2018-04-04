import { IMinimalAudioContextConstructor, IMinimalBaseAudioContextConstructor, INativeAudioContextConstructor } from '../interfaces';
import { TInvalidStateErrorFactory } from './invalid-state-error-factory';

export type TMinimalAudioContextConstructorFactory = (
    createInvalidStateError: TInvalidStateErrorFactory,
    minimalBaseAudioContextConstructor: IMinimalBaseAudioContextConstructor,
    nativeAudioContextConstructor: null | INativeAudioContextConstructor
) => IMinimalAudioContextConstructor;
