import { IMinimalAudioContextConstructor, IMinimalBaseAudioContextConstructor, IUnpatchedAudioContextConstructor } from '../interfaces';
import { TInvalidStateErrorFactory } from './invalid-state-error-factory';

export type TMinimalAudioContextConstructorFactory = (
    createInvalidStateError: TInvalidStateErrorFactory,
    minimalBaseAudioContextConstructor: IMinimalBaseAudioContextConstructor,
    unpatchedAudioContextConstructor: null | IUnpatchedAudioContextConstructor
) => IMinimalAudioContextConstructor;
