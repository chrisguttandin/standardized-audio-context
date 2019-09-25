import { TIsSupportedPromiseFactory } from '../types';

export const createIsSupportedPromise: TIsSupportedPromiseFactory = async (
    cacheTestResult,
    testAudioBufferCopyChannelMethodsSubarraySupport,
    testAudioContextCloseMethodSupport,
    testAudioContextDecodeAudioDataMethodTypeErrorSupport,
    testAudioContextOptionsSupport,
    testAudioNodeConnectMethodSupport,
    testAudioWorkletProcessorNoOutputsSupport,
    testConstantSourceNodeAccurateSchedulingSupport,
    testConvolverNodeBufferReassignabilitySupport,
    testIsSecureContextSupport,
    testStereoPannerNodeDefaultValueSupport,
    testTransferablesSupport
) => {
    try {
        if (cacheTestResult(testAudioBufferCopyChannelMethodsSubarraySupport, testAudioBufferCopyChannelMethodsSubarraySupport)
                && cacheTestResult(testAudioContextCloseMethodSupport, testAudioContextCloseMethodSupport)
                && cacheTestResult(testAudioContextOptionsSupport, testAudioContextOptionsSupport)
                && cacheTestResult(testAudioNodeConnectMethodSupport, testAudioNodeConnectMethodSupport)
                && cacheTestResult(testConstantSourceNodeAccurateSchedulingSupport, testConstantSourceNodeAccurateSchedulingSupport)
                && cacheTestResult(testConvolverNodeBufferReassignabilitySupport, testConvolverNodeBufferReassignabilitySupport)
                && cacheTestResult(testIsSecureContextSupport, testIsSecureContextSupport)) {
            const results = await Promise
                .all([
                    cacheTestResult(
                        testAudioContextDecodeAudioDataMethodTypeErrorSupport,
                        testAudioContextDecodeAudioDataMethodTypeErrorSupport
                    ),
                    cacheTestResult(testAudioWorkletProcessorNoOutputsSupport, testAudioWorkletProcessorNoOutputsSupport),
                    cacheTestResult(testStereoPannerNodeDefaultValueSupport, testStereoPannerNodeDefaultValueSupport),
                    cacheTestResult(testTransferablesSupport, testTransferablesSupport)
                ]);

            return results.every((result) => result);
        }
    } catch { /* Ignore errors. */ }

    return Promise.resolve(false);
};
