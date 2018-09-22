import { INativeOfflineAudioContextConstructor } from '../interfaces';

export type TTestChannelSplitterNodeChannelCountSupportFactory = (
    nativeOfflineAudioContextConstructor: null | INativeOfflineAudioContextConstructor
) => () => boolean;
