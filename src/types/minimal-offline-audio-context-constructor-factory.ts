import { TInvalidStateErrorFactory } from './invalid-state-error-factory';
import { TMinimalBaseAudioContextConstructor } from './minimal-base-audio-context-constructor';
import { TMinimalOfflineAudioContextConstructor } from './minimal-offline-audio-context-constructor';
import { TNativeOfflineAudioContextConstructor } from './native-offline-audio-context-constructor';
import { TStartRenderingFunction } from './start-rendering-function';

export type TMinimalOfflineAudioContextConstructorFactory = (
    createInvalidStateError: TInvalidStateErrorFactory,
    minimalBaseAudioContextConstructor: TMinimalBaseAudioContextConstructor,
    nativeOfflineAudioContextConstructor: null | TNativeOfflineAudioContextConstructor,
    startRendering: TStartRenderingFunction
) => TMinimalOfflineAudioContextConstructor;
