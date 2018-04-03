import { IBaseAudioContextConstructor, IOfflineAudioContextConstructor, IUnpatchedOfflineAudioContextConstructor } from '../interfaces';
import { TStartRenderingFunction } from './start-rendering-function';

export type TOfflineAudioContextConstructorFactory = (
    baseAudioContextConstructor: IBaseAudioContextConstructor,
    startRendering: TStartRenderingFunction,
    unpatchedOfflineAudioContextConstructor: null | IUnpatchedOfflineAudioContextConstructor
) => IOfflineAudioContextConstructor;
