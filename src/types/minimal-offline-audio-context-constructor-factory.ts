import {
    IMinimalBaseAudioContextConstructor,
    IMinimalOfflineAudioContextConstructor,
    INativeOfflineAudioContextConstructor
} from '../interfaces';
import { TInvalidStateErrorFactory } from './invalid-state-error-factory';
import { TStartRenderingFunction } from './start-rendering-function';

export type TMinimalOfflineAudioContextConstructorFactory = (
    createInvalidStateError: TInvalidStateErrorFactory,
    minimalBaseAudioContextConstructor: IMinimalBaseAudioContextConstructor,
    nativeOfflineAudioContextConstructor: null | INativeOfflineAudioContextConstructor,
    startRendering: TStartRenderingFunction
) => IMinimalOfflineAudioContextConstructor;
