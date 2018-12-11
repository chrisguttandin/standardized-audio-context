import { INativeOfflineAudioContextConstructor } from '../interfaces';

export type TTestStereoPannerNodeDefaultValueSupportFactory = (
    nativeOfflineAudioContextConstructor: null | INativeOfflineAudioContextConstructor
) => () => Promise<boolean>;
