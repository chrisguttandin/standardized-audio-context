import { cacheTestResult } from '../helpers/cache-test-result';
import { TIsSupportedPromiseFactory } from '../types';

export const createIsSupportedPromise: TIsSupportedPromiseFactory = (
    browsernizr,
    testAudioContextCloseMethodSupport,
    testAudioContextDecodeAudioDataMethodTypeErrorSupport,
    testAudioContextOptionsSupport,
    testChannelMergerNodeSupport,
    testChannelSplitterNodeChannelCountSupport,
    testConstantSourceNodeAccurateSchedulingSupport,
    testIsSecureContextSupport,
    testStereoPannerNodeDefaultValueSupport,
    testTransferablesSupport
) => {
    if (browsernizr.promises &&
            browsernizr.typedarrays &&
            browsernizr.webaudio &&
            cacheTestResult(testAudioContextCloseMethodSupport, () => testAudioContextCloseMethodSupport()) &&
            cacheTestResult(testAudioContextOptionsSupport, () => testAudioContextOptionsSupport()) &&
            cacheTestResult(testChannelSplitterNodeChannelCountSupport, () => testChannelSplitterNodeChannelCountSupport()) &&
            cacheTestResult(testConstantSourceNodeAccurateSchedulingSupport, () => testConstantSourceNodeAccurateSchedulingSupport()) &&
            cacheTestResult(testIsSecureContextSupport, () => testIsSecureContextSupport())) {
        return Promise
            .all([
                cacheTestResult(testAudioContextDecodeAudioDataMethodTypeErrorSupport, () => {
                    return testAudioContextDecodeAudioDataMethodTypeErrorSupport();
                }),
                cacheTestResult(testChannelMergerNodeSupport, () => testChannelMergerNodeSupport()),
                cacheTestResult(testStereoPannerNodeDefaultValueSupport, () => testStereoPannerNodeDefaultValueSupport()),
                cacheTestResult(testTransferablesSupport, () => testTransferablesSupport())
            ])
            .then((results) => results.every((result) => result));
    }

    return Promise.resolve(false);
};
