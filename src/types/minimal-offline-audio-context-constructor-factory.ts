import {
    IMinimalBaseAudioContextConstructor,
    IMinimalOfflineAudioContextConstructor,
    INativeOfflineAudioContextConstructor
} from '../interfaces';
import { TStartRenderingFunction } from './start-rendering-function';

export type TMinimalOfflineAudioContextConstructorFactory = (
    minimalBaseAudioContextConstructor: IMinimalBaseAudioContextConstructor,
    nativeOfflineAudioContextConstructor: null | INativeOfflineAudioContextConstructor,
    startRendering: TStartRenderingFunction
) => IMinimalOfflineAudioContextConstructor;
