import { TIsSupportedPromiseFactory } from '../types';

export const createIsSupportedPromise: TIsSupportedPromiseFactory = (
    cacheTestResult,
    testAudioBufferCopyChannelMethodsSubarraySupport,
    testAudioContextCloseMethodSupport,
    testAudioContextDecodeAudioDataMethodTypeErrorSupport,
    testAudioContextOptionsSupport,
    testAudioWorkletProcessorNoOutputsSupport,
    testConstantSourceNodeAccurateSchedulingSupport,
    testConvolverNodeBufferReassignabilitySupport,
    testIsSecureContextSupport,
    testStereoPannerNodeDefaultValueSupport,
    testTransferablesSupport
) => {
    if (cacheTestResult(testAudioBufferCopyChannelMethodsSubarraySupport, testAudioBufferCopyChannelMethodsSubarraySupport)
            && cacheTestResult(testAudioContextCloseMethodSupport, testAudioContextCloseMethodSupport)
            && cacheTestResult(testAudioContextOptionsSupport, testAudioContextOptionsSupport)
            && cacheTestResult(testConstantSourceNodeAccurateSchedulingSupport, testConstantSourceNodeAccurateSchedulingSupport)
            && cacheTestResult(testConvolverNodeBufferReassignabilitySupport, testConvolverNodeBufferReassignabilitySupport)
            && cacheTestResult(testIsSecureContextSupport, testIsSecureContextSupport)) {
        return Promise
            .all([
                cacheTestResult(
                    testAudioContextDecodeAudioDataMethodTypeErrorSupport,
                    testAudioContextDecodeAudioDataMethodTypeErrorSupport
                ),
                cacheTestResult(testAudioWorkletProcessorNoOutputsSupport, testAudioWorkletProcessorNoOutputsSupport),
                cacheTestResult(testStereoPannerNodeDefaultValueSupport, testStereoPannerNodeDefaultValueSupport),
                cacheTestResult(testTransferablesSupport, testTransferablesSupport)
            ])
            .then((results) => results.every((result) => result));
    }

    return Promise.resolve(false);
};
