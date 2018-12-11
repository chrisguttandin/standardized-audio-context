import { TBrowsernizr } from './browsernizr';

export type TIsSupportedPromiseFactory = (
    browsernizr: TBrowsernizr,
    testAsyncArrayBufferSupport: () => Promise<boolean>,
    testAudioContextCloseMethodSupport: () => boolean,
    testAudioContextDecodeAudioDataMethodTypeErrorSupport: () => Promise<boolean>,
    testAudioContextOptionsSupport: () => boolean,
    testChannelMergerNodeSupport: () => Promise<boolean>,
    testChannelSplitterNodeChannelCountSupport: () => boolean,
    testConstantSourceNodeAccurateSchedulingSupport: () => boolean,
    testIsSecureContextSupport: () => boolean,
    testStereoPannerNodeDefaultValueSupport: () => Promise<boolean>
) => Promise<boolean>;
