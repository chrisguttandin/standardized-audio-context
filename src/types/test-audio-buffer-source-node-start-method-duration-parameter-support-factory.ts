import { INativeOfflineAudioContextConstructor } from '../interfaces';

export type TTestAudioBufferSourceNodeStartMethodDurationParameterSupportFactory = (
    nativeOfflineAudioContextConstructor: null | INativeOfflineAudioContextConstructor
) => () => Promise<boolean>;
