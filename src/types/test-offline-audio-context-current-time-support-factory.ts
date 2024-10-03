import { TNativeOfflineAudioContextConstructor } from './native-offline-audio-context-constructor';

export type TTestOfflineAudioContextCurrentTimeSupportFactory = (
    nativeOfflineAudioContextConstructor: null | TNativeOfflineAudioContextConstructor
) => () => Promise<boolean>;
