import { IUnpatchedOfflineAudioContextConstructor } from '../interfaces';

export type TTestAudioContextDecodeAudioDataMethodTypeErrorSupportFactory = (
    unpatchedOfflineAudioContextConstructor: null | IUnpatchedOfflineAudioContextConstructor
) => () => Promise<boolean>;
