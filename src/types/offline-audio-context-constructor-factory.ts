import { IOfflineAudioContextConstructor } from '../interfaces';
import { TBaseAudioContextConstructor } from './base-audio-context-constructor';
import { TInvalidStateErrorFactory } from './invalid-state-error-factory';
import { TNativeOfflineAudioContextConstructor } from './native-offline-audio-context-constructor';
import { TStartRenderingFunction } from './start-rendering-function';

export type TOfflineAudioContextConstructorFactory = (
    baseAudioContextConstructor: TBaseAudioContextConstructor,
    createInvalidStateError: TInvalidStateErrorFactory,
    nativeOfflineAudioContextConstructor: null | TNativeOfflineAudioContextConstructor,
    startRendering: TStartRenderingFunction
) => IOfflineAudioContextConstructor;
