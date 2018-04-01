import { IUnpatchedAudioContextConstructor } from '../interfaces';

export type TTestChannelMergerNodeSupportFactory = (
    unpatchedAudioContextConstructor: null | IUnpatchedAudioContextConstructor
) => () => Promise<boolean>;
