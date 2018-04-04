import { INativeAudioContextConstructor } from '../interfaces';

export type TTestAudioContextOptionsSupportFactory = (
    nativeAudioContextConstructor: null | INativeAudioContextConstructor
) => () => boolean;
