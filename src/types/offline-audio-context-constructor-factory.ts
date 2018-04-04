import { IBaseAudioContextConstructor, INativeOfflineAudioContextConstructor, IOfflineAudioContextConstructor } from '../interfaces';
import { TStartRenderingFunction } from './start-rendering-function';

export type TOfflineAudioContextConstructorFactory = (
    baseAudioContextConstructor: IBaseAudioContextConstructor,
    nativeOfflineAudioContextConstructor: null | INativeOfflineAudioContextConstructor,
    startRendering: TStartRenderingFunction
) => IOfflineAudioContextConstructor;
