import { IUnpatchedAudioContextConstructor } from '../interfaces';

export type TTestAudioContextCloseMethodSupportFactory = (
    unpatchedAudioContextConstructor: null | IUnpatchedAudioContextConstructor
) => () => boolean;
