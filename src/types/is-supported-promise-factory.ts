import { TCacheTestResultFunction } from './cache-test-result-function';

export type TIsSupportedPromiseFactory = (
    cacheTestResult: TCacheTestResultFunction,
    testAudioContextCloseMethodSupport: () => boolean,
    testAudioContextDecodeAudioDataMethodTypeErrorSupport: () => Promise<boolean>,
    testAudioContextOptionsSupport: () => boolean,
    testAudioWorkletProcessorNoOutputsSupport: () => Promise<boolean>,
    testChannelSplitterNodeChannelCountSupport: () => boolean,
    testConstantSourceNodeAccurateSchedulingSupport: () => boolean,
    testConvolverNodeBufferReassignabilitySupport: () => boolean,
    testIsSecureContextSupport: () => boolean,
    testStereoPannerNodeDefaultValueSupport: () => Promise<boolean>,
    testTransferablesSupport: () => Promise<boolean>
) => Promise<boolean>;
