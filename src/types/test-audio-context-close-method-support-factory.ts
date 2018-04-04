import { INativeAudioContextConstructor } from '../interfaces';

export type TTestAudioContextCloseMethodSupportFactory = (
    nativeAudioContextConstructor: null | INativeAudioContextConstructor
) => () => boolean;
