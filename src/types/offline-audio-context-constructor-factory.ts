import { IBaseAudioContextConstructor, INativeOfflineAudioContextConstructor, IOfflineAudioContextConstructor } from '../interfaces';
import { TInvalidStateErrorFactory } from './invalid-state-error-factory';
import { TStartRenderingFunction } from './start-rendering-function';

export type TOfflineAudioContextConstructorFactory = (
    baseAudioContextConstructor: IBaseAudioContextConstructor,
    createInvalidStateError: TInvalidStateErrorFactory,
    nativeOfflineAudioContextConstructor: null | INativeOfflineAudioContextConstructor,
    startRendering: TStartRenderingFunction
) => IOfflineAudioContextConstructor;
