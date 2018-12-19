import { TNativeAudioContextConstructor } from './native-audio-context-constructor';

export type TTestChannelMergerNodeSupportFactory = (
    nativeAudioContextConstructor: null | TNativeAudioContextConstructor
) => () => Promise<boolean>;
