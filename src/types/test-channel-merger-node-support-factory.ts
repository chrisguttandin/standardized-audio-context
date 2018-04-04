import { INativeAudioContextConstructor } from '../interfaces';

export type TTestChannelMergerNodeSupportFactory = (
    nativeAudioContextConstructor: null | INativeAudioContextConstructor
) => () => Promise<boolean>;
