import { INativeOfflineAudioContextConstructor } from '../interfaces';

export type TTestAudioContextDecodeAudioDataMethodTypeErrorSupportFactory = (
    nativeOfflineAudioContextConstructor: null | INativeOfflineAudioContextConstructor
) => () => Promise<boolean>;
