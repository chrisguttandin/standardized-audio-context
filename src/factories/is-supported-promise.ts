import type { testDomExceptionConstructorSupport as testDomExceptionConstructorSupportFunction } from '../helpers/test-dom-exception-constructor-support';
import type { testErrorEventErrorPropertySupport as testErrorEventErrorPropertySupportFunction } from '../helpers/test-error-event-error-property-support';
import type { testTransferablesSupport as testTransferablesSupportFunction } from '../helpers/test-transferables-support';
import type { createCacheTestResult } from './cache-test-result';
import type { createTestAudioBufferConstructorSupport } from './test-audio-buffer-constructor-support';
import type { createTestAudioBufferCopyChannelMethodsSubarraySupport } from './test-audio-buffer-copy-channel-methods-subarray-support';
import type { createTestAudioContextCloseMethodSupport } from './test-audio-context-close-method-support';
import type { createTestAudioContextDecodeAudioDataMethodTypeErrorSupport } from './test-audio-context-decode-audio-data-method-type-error-support';
import type { createTestAudioContextOptionsSupport } from './test-audio-context-options-support';
import type { createTestAudioContextResumeSupport } from './test-audio-context-resume-support';
import type { createTestAudioNodeConnectMethodChainabilitySupport } from './test-audio-node-connect-method-chainability-support';
import type { createTestAudioNodeConnectMethodVerificationSupport } from './test-audio-node-connect-method-verification-support';
import type { createTestAudioWorkletProcessorNoInputsSupport } from './test-audio-worklet-processor-no-inputs-support';
import type { createTestAudioWorkletProcessorNoOutputsSupport } from './test-audio-worklet-processor-no-outputs-support';
import type { createTestBiquadFilterNodeGetFrequencyResponseMethodSupport } from './test-biquad-filter-node-get-frequency-response-method-support';
import type { createTestChannelMergerNodeChannelCountSupport } from './test-channel-merger-node-channel-count-support';
import type { createTestConstantSourceNodeAccurateSchedulingSupport } from './test-constant-source-node-accurate-scheduling-support';
import type { createTestConvolverNodeBufferReassignabilitySupport } from './test-convolver-node-buffer-reassignability-support';
import type { createTestConvolverNodeChannelCountSupport } from './test-convolver-node-channel-count-support';
import type { createTestIsSecureContextSupport } from './test-is-secure-context-support';
import type { createTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport } from './test-media-stream-audio-source-node-media-stream-without-audio-track-support';
import type { createTestStereoPannerNodeDefaultValueSupport } from './test-stereo-panner-node-default-value-support';

export const createIsSupportedPromise = async (
    cacheTestResult: ReturnType<typeof createCacheTestResult>,
    testAudioBufferConstructorSupport: ReturnType<typeof createTestAudioBufferConstructorSupport>,
    testAudioBufferCopyChannelMethodsSubarraySupport: ReturnType<typeof createTestAudioBufferCopyChannelMethodsSubarraySupport>,
    testAudioContextCloseMethodSupport: ReturnType<typeof createTestAudioContextCloseMethodSupport>,
    testAudioContextDecodeAudioDataMethodTypeErrorSupport: ReturnType<typeof createTestAudioContextDecodeAudioDataMethodTypeErrorSupport>,
    testAudioContextOptionsSupport: ReturnType<typeof createTestAudioContextOptionsSupport>,
    testAudioContextResumeSupport: ReturnType<typeof createTestAudioContextResumeSupport>,
    testAudioNodeConnectMethodChainabilitySupport: ReturnType<typeof createTestAudioNodeConnectMethodChainabilitySupport>,
    testAudioNodeConnectMethodVerificationSupport: ReturnType<typeof createTestAudioNodeConnectMethodVerificationSupport>,
    testAudioWorkletProcessorNoInputsSupport: ReturnType<typeof createTestAudioWorkletProcessorNoInputsSupport>,
    testAudioWorkletProcessorNoOutputsSupport: ReturnType<typeof createTestAudioWorkletProcessorNoOutputsSupport>,
    testBiquadFilterNodeGetFrequencyResponseMethodSupport: ReturnType<typeof createTestBiquadFilterNodeGetFrequencyResponseMethodSupport>,
    testChannelMergerNodeChannelCountSupport: ReturnType<typeof createTestChannelMergerNodeChannelCountSupport>,
    testConstantSourceNodeAccurateSchedulingSupport: ReturnType<typeof createTestConstantSourceNodeAccurateSchedulingSupport>,
    testConvolverNodeBufferReassignabilitySupport: ReturnType<typeof createTestConvolverNodeBufferReassignabilitySupport>,
    testConvolverNodeChannelCountSupport: ReturnType<typeof createTestConvolverNodeChannelCountSupport>,
    testDomExceptionConstructorSupport: typeof testDomExceptionConstructorSupportFunction,
    testErrorEventErrorPropertySupport: typeof testErrorEventErrorPropertySupportFunction,
    testIsSecureContextSupport: ReturnType<typeof createTestIsSecureContextSupport>,
    testMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport: ReturnType<
        typeof createTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport
    >,
    testStereoPannerNodeDefaultValueSupport: ReturnType<typeof createTestStereoPannerNodeDefaultValueSupport>,
    testTransferablesSupport: typeof testTransferablesSupportFunction
) => {
    if (
        cacheTestResult(testAudioBufferConstructorSupport, testAudioBufferConstructorSupport) &&
        cacheTestResult(testAudioBufferCopyChannelMethodsSubarraySupport, testAudioBufferCopyChannelMethodsSubarraySupport) &&
        cacheTestResult(testAudioContextCloseMethodSupport, testAudioContextCloseMethodSupport) &&
        cacheTestResult(testAudioContextOptionsSupport, testAudioContextOptionsSupport) &&
        cacheTestResult(testAudioNodeConnectMethodChainabilitySupport, testAudioNodeConnectMethodChainabilitySupport) &&
        cacheTestResult(testAudioNodeConnectMethodVerificationSupport, testAudioNodeConnectMethodVerificationSupport) &&
        cacheTestResult(testBiquadFilterNodeGetFrequencyResponseMethodSupport, testBiquadFilterNodeGetFrequencyResponseMethodSupport) &&
        cacheTestResult(testChannelMergerNodeChannelCountSupport, testChannelMergerNodeChannelCountSupport) &&
        cacheTestResult(testConstantSourceNodeAccurateSchedulingSupport, testConstantSourceNodeAccurateSchedulingSupport) &&
        cacheTestResult(testConvolverNodeBufferReassignabilitySupport, testConvolverNodeBufferReassignabilitySupport) &&
        cacheTestResult(testConvolverNodeChannelCountSupport, testConvolverNodeChannelCountSupport) &&
        cacheTestResult(testDomExceptionConstructorSupport, testDomExceptionConstructorSupport) &&
        cacheTestResult(testErrorEventErrorPropertySupport, testErrorEventErrorPropertySupport) &&
        cacheTestResult(testIsSecureContextSupport, testIsSecureContextSupport) &&
        cacheTestResult(
            testMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
            testMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport
        )
    ) {
        const results = await Promise.all([
            cacheTestResult(testAudioContextDecodeAudioDataMethodTypeErrorSupport, testAudioContextDecodeAudioDataMethodTypeErrorSupport),
            cacheTestResult(testAudioContextResumeSupport, testAudioContextResumeSupport),
            cacheTestResult(testAudioWorkletProcessorNoInputsSupport, testAudioWorkletProcessorNoInputsSupport),
            cacheTestResult(testAudioWorkletProcessorNoOutputsSupport, testAudioWorkletProcessorNoOutputsSupport),
            cacheTestResult(testStereoPannerNodeDefaultValueSupport, testStereoPannerNodeDefaultValueSupport),
            cacheTestResult(testTransferablesSupport, testTransferablesSupport)
        ]);

        return results.every((result) => result);
    }

    return false;
};
