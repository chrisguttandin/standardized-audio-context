import { INativeAudioBufferConstructor } from '../interfaces';

export type TTestAudioBufferConstructorSupportFactory = (
    nativeAudioBufferConstructor: null | INativeAudioBufferConstructor
) => () => boolean;
