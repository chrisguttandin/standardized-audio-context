import { cacheTestResult } from '../helpers/cache-test-result';
import { TIsSupportedPromiseFactory } from '../types';

export const createIsSupportedPromise: TIsSupportedPromiseFactory = (
    browsernizr,
    testAsyncArrayBufferSupport,
    testAudioContextCloseMethodSupport,
    testAudioContextDecodeAudioDataMethodTypeErrorSupport,
    testAudioContextOptionsSupport,
    testChannelMergerNodeSupport,
    testChannelSplitterNodeChannelCountSupport,
    testConstantSourceNodeAccurateSchedulingSupport,
    testIsSecureContextSupport
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
                cacheTestResult(testAsyncArrayBufferSupport, () => testAsyncArrayBufferSupport()),
                cacheTestResult(testAudioContextDecodeAudioDataMethodTypeErrorSupport, () => {
                    return testAudioContextDecodeAudioDataMethodTypeErrorSupport();
                }),
                cacheTestResult(testChannelMergerNodeSupport, () => testChannelMergerNodeSupport())
            ])
            .then(([ asyncArrayBufferSupport, audioContextDecodeAudioDataMethodTypeErrorSupport, channelMergerNodeSupport ]) => {
                return asyncArrayBufferSupport && audioContextDecodeAudioDataMethodTypeErrorSupport && channelMergerNodeSupport;
            });
    }

    return Promise.resolve(false);
};
