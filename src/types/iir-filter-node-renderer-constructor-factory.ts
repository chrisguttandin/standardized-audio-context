import {
    IIIRFilterNodeRendererConstructor,
    IUnpatchedOfflineAudioContextConstructor
} from '../interfaces';

export type TIIRFilterNodeRendererConstructorFactory = (
    unpatchedOfflineAudioContextConstructor: null | IUnpatchedOfflineAudioContextConstructor
) => IIIRFilterNodeRendererConstructor;
