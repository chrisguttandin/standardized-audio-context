import { TInvalidStateErrorFactory } from './invalid-state-error-factory';
import { TMinimalAudioContextConstructor } from './minimal-audio-context-constructor';
import { TMinimalBaseAudioContextConstructor } from './minimal-base-audio-context-constructor';
import { TNativeAudioContextConstructor } from './native-audio-context-constructor';
import { TNotSupportedErrorFactory } from './not-supported-error-factory';

export type TMinimalAudioContextConstructorFactory = (
    createInvalidStateError: TInvalidStateErrorFactory,
    createNotSupportedError: TNotSupportedErrorFactory,
    minimalBaseAudioContextConstructor: TMinimalBaseAudioContextConstructor,
    nativeAudioContextConstructor: null | TNativeAudioContextConstructor
) => TMinimalAudioContextConstructor;
