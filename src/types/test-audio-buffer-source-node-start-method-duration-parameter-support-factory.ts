import { TNativeOfflineAudioContextConstructor } from './native-offline-audio-context-constructor';

export type TTestAudioBufferSourceNodeStartMethodDurationParameterSupportFactory = (
    nativeOfflineAudioContextConstructor: null | TNativeOfflineAudioContextConstructor
) => () => Promise<boolean>;
