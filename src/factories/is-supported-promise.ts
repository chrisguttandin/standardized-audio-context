import { cacheTestResult } from '../helpers/cache-test-result';
import { TIsSupportedPromiseFactory } from '../types';

export const createIsSupportedPromise: TIsSupportedPromiseFactory = (
    browsernizr,
    testAudioContextCloseMethodSupport,
    testAudioContextDecodeAudioDataMethodTypeErrorSupport,
    testAudioContextOptionsSupport,
    testChannelMergerNodeSupport,
    testChannelSplitterNodeChannelCountSupport,
    testIsSecureContextSupport
) => {
    if (browsernizr.promises &&
            browsernizr.typedarrays &&
            browsernizr.webaudio &&
            cacheTestResult(testAudioContextCloseMethodSupport, () => testAudioContextCloseMethodSupport()) &&
            cacheTestResult(testAudioContextOptionsSupport, () => testAudioContextOptionsSupport()) &&
            cacheTestResult(testChannelSplitterNodeChannelCountSupport, () => testChannelSplitterNodeChannelCountSupport()) &&
            cacheTestResult(testIsSecureContextSupport, () => testIsSecureContextSupport())) {
        return Promise
            .all([
                cacheTestResult(testAudioContextDecodeAudioDataMethodTypeErrorSupport, () => {
                    return testAudioContextDecodeAudioDataMethodTypeErrorSupport();
                }),
                cacheTestResult(testChannelMergerNodeSupport, () => testChannelMergerNodeSupport())
            ])
            .then(([ audioContextDecodeAudioDataMethodTypeErrorSupport, channelMergerNodeSupport ]) => {
                return audioContextDecodeAudioDataMethodTypeErrorSupport && channelMergerNodeSupport;
            });
    }

    return Promise.resolve(false);
};
