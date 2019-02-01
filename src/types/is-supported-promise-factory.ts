import { TBrowsernizr } from './browsernizr';

export type TIsSupportedPromiseFactory = (
    browsernizr: TBrowsernizr,
    testAudioContextCloseMethodSupport: () => boolean,
    testAudioContextDecodeAudioDataMethodTypeErrorSupport: () => Promise<boolean>,
    testAudioContextOptionsSupport: () => boolean,
    testAudioWorkletProcessorNoOutputsSupport: () => Promise<boolean>,
    testChannelMergerNodeSupport: () => Promise<boolean>,
    testChannelSplitterNodeChannelCountSupport: () => boolean,
    testConstantSourceNodeAccurateSchedulingSupport: () => boolean,
    testIsSecureContextSupport: () => boolean,
    testStereoPannerNodeDefaultValueSupport: () => Promise<boolean>,
    testTransferablesSupport: () => Promise<boolean>
) => Promise<boolean>;
