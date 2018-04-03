import {
    IMinimalBaseAudioContextConstructor,
    IMinimalOfflineAudioContextConstructor,
    IUnpatchedOfflineAudioContextConstructor
} from '../interfaces';
import { TStartRenderingFunction } from './start-rendering-function';

export type TMinimalOfflineAudioContextConstructorFactory = (
    minimalBaseAudioContextConstructor: IMinimalBaseAudioContextConstructor,
    startRendering: TStartRenderingFunction,
    unpatchedOfflineAudioContextConstructor: null | IUnpatchedOfflineAudioContextConstructor
) => IMinimalOfflineAudioContextConstructor;
