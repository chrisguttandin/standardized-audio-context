import { IUnpatchedAudioContextConstructor } from '../interfaces';

export type TTestAudioContextOptionsSupportFactory = (
    unpatchedAudioContextConstructor: null | IUnpatchedAudioContextConstructor
) => () => boolean;
