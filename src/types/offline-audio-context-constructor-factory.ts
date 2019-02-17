import { IOfflineAudioContextConstructor } from '../interfaces';
import { TBaseAudioContextConstructor } from './base-audio-context-constructor';
import { TCreateNativeOfflineAudioContextFunction } from './create-native-offline-audio-context-function';
import { TInvalidStateErrorFactory } from './invalid-state-error-factory';
import { TStartRenderingFunction } from './start-rendering-function';

export type TOfflineAudioContextConstructorFactory = (
    baseAudioContextConstructor: TBaseAudioContextConstructor,
    createInvalidStateError: TInvalidStateErrorFactory,
    createNativeOfflineAudioContext: TCreateNativeOfflineAudioContextFunction,
    startRendering: TStartRenderingFunction
) => IOfflineAudioContextConstructor;
