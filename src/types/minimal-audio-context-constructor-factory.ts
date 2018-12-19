import { TInvalidStateErrorFactory } from './invalid-state-error-factory';
import { TMinimalAudioContextConstructor } from './minimal-audio-context-constructor';
import { TMinimalBaseAudioContextConstructor } from './minimal-base-audio-context-constructor';
import { TNativeAudioContextConstructor } from './native-audio-context-constructor';

export type TMinimalAudioContextConstructorFactory = (
    createInvalidStateError: TInvalidStateErrorFactory,
    minimalBaseAudioContextConstructor: TMinimalBaseAudioContextConstructor,
    nativeAudioContextConstructor: null | TNativeAudioContextConstructor
) => TMinimalAudioContextConstructor;
