import { TNativeOfflineAudioContextConstructor } from './native-offline-audio-context-constructor';

export type TTestChannelSplitterNodeChannelCountSupportFactory = (
    nativeOfflineAudioContextConstructor: null | TNativeOfflineAudioContextConstructor
) => () => boolean;
