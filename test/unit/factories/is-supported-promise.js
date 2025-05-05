import { createCacheTestResult } from '../../../src/factories/cache-test-result';
import { createIsSupportedPromise } from '../../../src/factories/is-supported-promise';

describe('createIsSupportedPromise()', () => {
    let cacheTestResult;
    let fakeTestAudioBufferConstructorSupport;
    let fakeTestAudioBufferCopyChannelMethodsOutOfBoundsSupport;
    let fakeTestAudioBufferCopyChannelMethodsSubarraySupport;
    let fakeTestAudioBufferFactoryMethodSupport;
    let fakeTestAudioBufferSourceNodeBufferReassignmentSupport;
    let fakeTestAudioContextCloseMethodSupport;
    let fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport;
    let fakeTestAudioContextGetOutputTimestampSupport;
    let fakeTestAudioContextOptionsSupport;
    let fakeTestAudioContextResumeSupport;
    let fakeTestAudioNodeConnectMethodChainabilitySupport;
    let fakeTestAudioNodeConnectMethodVerificationSupport;
    let fakeTestAudioParamValueSetterSupport;
    let fakeTestAudioWorkletAddModuleMethodSupport;
    let fakeTestAudioWorkletNodeConstructorSupport;
    let fakeTestAudioWorkletProcessorNoInputsSupport;
    let fakeTestAudioWorkletProcessorNoOutputsSupport;
    let fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport;
    let fakeTestChannelMergerNodeChannelCountSupport;
    let fakeTestConstantSourceNodeAccurateSchedulingSupport;
    let fakeTestConvolverNodeBufferReassignabilitySupport;
    let fakeTestConvolverNodeChannelCountSupport;
    let fakeTestDomExceptionConstructorSupport;
    let fakeTestErrorEventErrorPropertySupport;
    let fakeTestIsSecureContextSupport;
    let fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport;
    let fakeTestPeriodicWaveConstructorSupport;
    let fakeTestStereoPannerNodeDefaultValueSupport;
    let fakeTestTransferablesSupport;

    beforeEach(() => {
        cacheTestResult = createCacheTestResult(new Map(), new WeakMap());
        fakeTestAudioBufferConstructorSupport = () => true;
        fakeTestAudioBufferCopyChannelMethodsOutOfBoundsSupport = () => true;
        fakeTestAudioBufferCopyChannelMethodsSubarraySupport = () => true;
        fakeTestAudioBufferFactoryMethodSupport = () => true;
        fakeTestAudioBufferSourceNodeBufferReassignmentSupport = () => true;
        fakeTestAudioContextCloseMethodSupport = () => true;
        fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport = () => Promise.resolve(true);
        fakeTestAudioContextGetOutputTimestampSupport = () => Promise.resolve(true);
        fakeTestAudioContextOptionsSupport = () => true;
        fakeTestAudioContextResumeSupport = () => Promise.resolve(true);
        fakeTestAudioNodeConnectMethodChainabilitySupport = () => true;
        fakeTestAudioNodeConnectMethodVerificationSupport = () => true;
        fakeTestAudioParamValueSetterSupport = () => Promise.resolve(true);
        fakeTestAudioWorkletAddModuleMethodSupport = () => Promise.resolve(true);
        fakeTestAudioWorkletNodeConstructorSupport = () => true;
        fakeTestAudioWorkletProcessorNoInputsSupport = () => Promise.resolve(true);
        fakeTestAudioWorkletProcessorNoOutputsSupport = () => Promise.resolve(true);
        fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport = () => true;
        fakeTestChannelMergerNodeChannelCountSupport = () => true;
        fakeTestConstantSourceNodeAccurateSchedulingSupport = () => true;
        fakeTestConvolverNodeBufferReassignabilitySupport = () => true;
        fakeTestConvolverNodeChannelCountSupport = () => true;
        fakeTestDomExceptionConstructorSupport = () => true;
        fakeTestErrorEventErrorPropertySupport = () => true;
        fakeTestIsSecureContextSupport = () => true;
        fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport = () => true;
        fakeTestPeriodicWaveConstructorSupport = () => true;
        fakeTestStereoPannerNodeDefaultValueSupport = () => Promise.resolve(true);
        fakeTestTransferablesSupport = () => Promise.resolve(true);
    });

    it('should resolve to true if all tests pass', async () => {
        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferConstructorSupport,
            fakeTestAudioBufferCopyChannelMethodsOutOfBoundsSupport,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioBufferFactoryMethodSupport,
            fakeTestAudioBufferSourceNodeBufferReassignmentSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextGetOutputTimestampSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioContextResumeSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioParamValueSetterSupport,
            fakeTestAudioWorkletAddModuleMethodSupport,
            fakeTestAudioWorkletNodeConstructorSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestErrorEventErrorPropertySupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
            fakeTestPeriodicWaveConstructorSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.true;
    });

    it('should resolve to false if the test for constructor support of an AudioBuffer fails', async () => {
        fakeTestAudioBufferConstructorSupport = () => false;

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferConstructorSupport,
            fakeTestAudioBufferCopyChannelMethodsOutOfBoundsSupport,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioBufferFactoryMethodSupport,
            fakeTestAudioBufferSourceNodeBufferReassignmentSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextGetOutputTimestampSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioContextResumeSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioParamValueSetterSupport,
            fakeTestAudioWorkletAddModuleMethodSupport,
            fakeTestAudioWorkletNodeConstructorSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestErrorEventErrorPropertySupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
            fakeTestPeriodicWaveConstructorSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for constructor support of an AudioBuffer throws', async () => {
        fakeTestAudioBufferConstructorSupport = () => {
            throw new Error('A fake error thrown by the test.');
        };

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferConstructorSupport,
            fakeTestAudioBufferCopyChannelMethodsOutOfBoundsSupport,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioBufferFactoryMethodSupport,
            fakeTestAudioBufferSourceNodeBufferReassignmentSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextGetOutputTimestampSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioContextResumeSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioParamValueSetterSupport,
            fakeTestAudioWorkletAddModuleMethodSupport,
            fakeTestAudioWorkletNodeConstructorSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestErrorEventErrorPropertySupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
            fakeTestPeriodicWaveConstructorSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for copyFromChannel and copyToChannel methods out-of-bounds support of an AudioBuffer fails', async () => {
        fakeTestAudioBufferCopyChannelMethodsOutOfBoundsSupport = () => false;

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferConstructorSupport,
            fakeTestAudioBufferCopyChannelMethodsOutOfBoundsSupport,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioBufferFactoryMethodSupport,
            fakeTestAudioBufferSourceNodeBufferReassignmentSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextGetOutputTimestampSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioContextResumeSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioParamValueSetterSupport,
            fakeTestAudioWorkletAddModuleMethodSupport,
            fakeTestAudioWorkletNodeConstructorSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestErrorEventErrorPropertySupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
            fakeTestPeriodicWaveConstructorSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for copyFromChannel and copyToChannel methods out-of-bounds support of an AudioBuffer throws', async () => {
        fakeTestAudioBufferCopyChannelMethodsOutOfBoundsSupport = () => {
            throw new Error('A fake error thrown by the test.');
        };

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferConstructorSupport,
            fakeTestAudioBufferCopyChannelMethodsOutOfBoundsSupport,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioBufferFactoryMethodSupport,
            fakeTestAudioBufferSourceNodeBufferReassignmentSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextGetOutputTimestampSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioContextResumeSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioParamValueSetterSupport,
            fakeTestAudioWorkletAddModuleMethodSupport,
            fakeTestAudioWorkletNodeConstructorSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestErrorEventErrorPropertySupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
            fakeTestPeriodicWaveConstructorSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for copyFromChannel and copyToChannel methods subarray support of an AudioBuffer fails', async () => {
        fakeTestAudioBufferCopyChannelMethodsSubarraySupport = () => false;

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferConstructorSupport,
            fakeTestAudioBufferCopyChannelMethodsOutOfBoundsSupport,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioBufferFactoryMethodSupport,
            fakeTestAudioBufferSourceNodeBufferReassignmentSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextGetOutputTimestampSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioContextResumeSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioParamValueSetterSupport,
            fakeTestAudioWorkletAddModuleMethodSupport,
            fakeTestAudioWorkletNodeConstructorSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestErrorEventErrorPropertySupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
            fakeTestPeriodicWaveConstructorSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for copyFromChannel and copyToChannel methods subarray support of an AudioBuffer throws', async () => {
        fakeTestAudioBufferCopyChannelMethodsSubarraySupport = () => {
            throw new Error('A fake error thrown by the test.');
        };

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferConstructorSupport,
            fakeTestAudioBufferCopyChannelMethodsOutOfBoundsSupport,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioBufferFactoryMethodSupport,
            fakeTestAudioBufferSourceNodeBufferReassignmentSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextGetOutputTimestampSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioContextResumeSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioParamValueSetterSupport,
            fakeTestAudioWorkletAddModuleMethodSupport,
            fakeTestAudioWorkletNodeConstructorSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestErrorEventErrorPropertySupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
            fakeTestPeriodicWaveConstructorSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for AudioBuffer factory method support fails', async () => {
        fakeTestAudioBufferFactoryMethodSupport = () => false;

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferConstructorSupport,
            fakeTestAudioBufferCopyChannelMethodsOutOfBoundsSupport,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioBufferFactoryMethodSupport,
            fakeTestAudioBufferSourceNodeBufferReassignmentSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextGetOutputTimestampSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioContextResumeSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioParamValueSetterSupport,
            fakeTestAudioWorkletAddModuleMethodSupport,
            fakeTestAudioWorkletNodeConstructorSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestErrorEventErrorPropertySupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
            fakeTestPeriodicWaveConstructorSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for AudioBuffer factory method support throws', async () => {
        fakeTestAudioBufferFactoryMethodSupport = () => {
            throw new Error('A fake error thrown by the test.');
        };

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferConstructorSupport,
            fakeTestAudioBufferCopyChannelMethodsOutOfBoundsSupport,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioBufferFactoryMethodSupport,
            fakeTestAudioBufferSourceNodeBufferReassignmentSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextGetOutputTimestampSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioContextResumeSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioParamValueSetterSupport,
            fakeTestAudioWorkletAddModuleMethodSupport,
            fakeTestAudioWorkletNodeConstructorSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestErrorEventErrorPropertySupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
            fakeTestPeriodicWaveConstructorSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for AudioBuffer reassignment support fails', async () => {
        fakeTestAudioBufferSourceNodeBufferReassignmentSupport = () => false;

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferConstructorSupport,
            fakeTestAudioBufferCopyChannelMethodsOutOfBoundsSupport,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioBufferFactoryMethodSupport,
            fakeTestAudioBufferSourceNodeBufferReassignmentSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextGetOutputTimestampSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioContextResumeSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioParamValueSetterSupport,
            fakeTestAudioWorkletAddModuleMethodSupport,
            fakeTestAudioWorkletNodeConstructorSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestErrorEventErrorPropertySupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
            fakeTestPeriodicWaveConstructorSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for AudioBuffer reassignment support throws', async () => {
        fakeTestAudioBufferSourceNodeBufferReassignmentSupport = () => {
            throw new Error('A fake error thrown by the test.');
        };

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferConstructorSupport,
            fakeTestAudioBufferCopyChannelMethodsOutOfBoundsSupport,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioBufferFactoryMethodSupport,
            fakeTestAudioBufferSourceNodeBufferReassignmentSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextGetOutputTimestampSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioContextResumeSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioParamValueSetterSupport,
            fakeTestAudioWorkletAddModuleMethodSupport,
            fakeTestAudioWorkletNodeConstructorSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestErrorEventErrorPropertySupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
            fakeTestPeriodicWaveConstructorSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for close support fails', async () => {
        fakeTestAudioContextCloseMethodSupport = () => false;

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferConstructorSupport,
            fakeTestAudioBufferCopyChannelMethodsOutOfBoundsSupport,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioBufferFactoryMethodSupport,
            fakeTestAudioBufferSourceNodeBufferReassignmentSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextGetOutputTimestampSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioContextResumeSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioParamValueSetterSupport,
            fakeTestAudioWorkletAddModuleMethodSupport,
            fakeTestAudioWorkletNodeConstructorSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestErrorEventErrorPropertySupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
            fakeTestPeriodicWaveConstructorSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for close support throws', async () => {
        fakeTestAudioContextCloseMethodSupport = () => {
            throw new Error('A fake error thrown by the test.');
        };

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferConstructorSupport,
            fakeTestAudioBufferCopyChannelMethodsOutOfBoundsSupport,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioBufferFactoryMethodSupport,
            fakeTestAudioBufferSourceNodeBufferReassignmentSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextGetOutputTimestampSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioContextResumeSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioParamValueSetterSupport,
            fakeTestAudioWorkletAddModuleMethodSupport,
            fakeTestAudioWorkletNodeConstructorSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestErrorEventErrorPropertySupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
            fakeTestPeriodicWaveConstructorSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for decodeAudioData TypeError support fails', async () => {
        fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport = () => Promise.resolve(false);

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferConstructorSupport,
            fakeTestAudioBufferCopyChannelMethodsOutOfBoundsSupport,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioBufferFactoryMethodSupport,
            fakeTestAudioBufferSourceNodeBufferReassignmentSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextGetOutputTimestampSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioContextResumeSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioParamValueSetterSupport,
            fakeTestAudioWorkletAddModuleMethodSupport,
            fakeTestAudioWorkletNodeConstructorSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestErrorEventErrorPropertySupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
            fakeTestPeriodicWaveConstructorSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for decodeAudioData TypeError support throws', async () => {
        fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport = () => Promise.reject(new Error('A fake error thrown by the test.'));

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferConstructorSupport,
            fakeTestAudioBufferCopyChannelMethodsOutOfBoundsSupport,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioBufferFactoryMethodSupport,
            fakeTestAudioBufferSourceNodeBufferReassignmentSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextGetOutputTimestampSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioContextResumeSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioParamValueSetterSupport,
            fakeTestAudioWorkletAddModuleMethodSupport,
            fakeTestAudioWorkletNodeConstructorSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestErrorEventErrorPropertySupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
            fakeTestPeriodicWaveConstructorSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for getOutputTimestamp() support fails', async () => {
        fakeTestAudioContextGetOutputTimestampSupport = () => Promise.resolve(false);

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferConstructorSupport,
            fakeTestAudioBufferCopyChannelMethodsOutOfBoundsSupport,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioBufferFactoryMethodSupport,
            fakeTestAudioBufferSourceNodeBufferReassignmentSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextGetOutputTimestampSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioContextResumeSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioParamValueSetterSupport,
            fakeTestAudioWorkletAddModuleMethodSupport,
            fakeTestAudioWorkletNodeConstructorSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestErrorEventErrorPropertySupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
            fakeTestPeriodicWaveConstructorSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for getOutputTimestamp() support throws', async () => {
        fakeTestAudioContextGetOutputTimestampSupport = () => Promise.reject(new Error('A fake error thrown by the test.'));

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferConstructorSupport,
            fakeTestAudioBufferCopyChannelMethodsOutOfBoundsSupport,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioBufferFactoryMethodSupport,
            fakeTestAudioBufferSourceNodeBufferReassignmentSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextGetOutputTimestampSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioContextResumeSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioParamValueSetterSupport,
            fakeTestAudioWorkletAddModuleMethodSupport,
            fakeTestAudioWorkletNodeConstructorSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestErrorEventErrorPropertySupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
            fakeTestPeriodicWaveConstructorSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for AudioContextOptions support fails', async () => {
        fakeTestAudioContextOptionsSupport = () => false;

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferConstructorSupport,
            fakeTestAudioBufferCopyChannelMethodsOutOfBoundsSupport,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioBufferFactoryMethodSupport,
            fakeTestAudioBufferSourceNodeBufferReassignmentSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextGetOutputTimestampSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioContextResumeSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioParamValueSetterSupport,
            fakeTestAudioWorkletAddModuleMethodSupport,
            fakeTestAudioWorkletNodeConstructorSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestErrorEventErrorPropertySupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
            fakeTestPeriodicWaveConstructorSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for AudioContextOptions support throws', async () => {
        fakeTestAudioContextOptionsSupport = () => {
            throw new Error('A fake error thrown by the test.');
        };

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferConstructorSupport,
            fakeTestAudioBufferCopyChannelMethodsOutOfBoundsSupport,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioBufferFactoryMethodSupport,
            fakeTestAudioBufferSourceNodeBufferReassignmentSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextGetOutputTimestampSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioContextResumeSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioParamValueSetterSupport,
            fakeTestAudioWorkletAddModuleMethodSupport,
            fakeTestAudioWorkletNodeConstructorSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestErrorEventErrorPropertySupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
            fakeTestPeriodicWaveConstructorSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for resume() method support of an AudioContext fails', async () => {
        fakeTestAudioContextResumeSupport = () => Promise.resolve(false);

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferConstructorSupport,
            fakeTestAudioBufferCopyChannelMethodsOutOfBoundsSupport,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioBufferFactoryMethodSupport,
            fakeTestAudioBufferSourceNodeBufferReassignmentSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextGetOutputTimestampSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioContextResumeSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioParamValueSetterSupport,
            fakeTestAudioWorkletAddModuleMethodSupport,
            fakeTestAudioWorkletNodeConstructorSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestErrorEventErrorPropertySupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
            fakeTestPeriodicWaveConstructorSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for resume() method support of an AudioContext throws', async () => {
        fakeTestAudioContextResumeSupport = () => Promise.reject(new Error('A fake error thrown by the test.'));

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferConstructorSupport,
            fakeTestAudioBufferCopyChannelMethodsOutOfBoundsSupport,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioBufferFactoryMethodSupport,
            fakeTestAudioBufferSourceNodeBufferReassignmentSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextGetOutputTimestampSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioContextResumeSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioParamValueSetterSupport,
            fakeTestAudioWorkletAddModuleMethodSupport,
            fakeTestAudioWorkletNodeConstructorSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestErrorEventErrorPropertySupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
            fakeTestPeriodicWaveConstructorSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for chainability support of the connect() method of an AudioNode fails', async () => {
        fakeTestAudioNodeConnectMethodChainabilitySupport = () => false;

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferConstructorSupport,
            fakeTestAudioBufferCopyChannelMethodsOutOfBoundsSupport,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioBufferFactoryMethodSupport,
            fakeTestAudioBufferSourceNodeBufferReassignmentSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextGetOutputTimestampSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioContextResumeSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioParamValueSetterSupport,
            fakeTestAudioWorkletAddModuleMethodSupport,
            fakeTestAudioWorkletNodeConstructorSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestErrorEventErrorPropertySupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
            fakeTestPeriodicWaveConstructorSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for chainability support of the connect() method of an AudioNode throws', async () => {
        fakeTestAudioNodeConnectMethodChainabilitySupport = () => {
            throw new Error('A fake error thrown by the test.');
        };

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferConstructorSupport,
            fakeTestAudioBufferCopyChannelMethodsOutOfBoundsSupport,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioBufferFactoryMethodSupport,
            fakeTestAudioBufferSourceNodeBufferReassignmentSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextGetOutputTimestampSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioContextResumeSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioParamValueSetterSupport,
            fakeTestAudioWorkletAddModuleMethodSupport,
            fakeTestAudioWorkletNodeConstructorSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestErrorEventErrorPropertySupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
            fakeTestPeriodicWaveConstructorSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for verification support of the connect() method of an AudioNode fails', async () => {
        fakeTestAudioNodeConnectMethodVerificationSupport = () => false;

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferConstructorSupport,
            fakeTestAudioBufferCopyChannelMethodsOutOfBoundsSupport,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioBufferFactoryMethodSupport,
            fakeTestAudioBufferSourceNodeBufferReassignmentSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextGetOutputTimestampSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioContextResumeSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioParamValueSetterSupport,
            fakeTestAudioWorkletAddModuleMethodSupport,
            fakeTestAudioWorkletNodeConstructorSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestErrorEventErrorPropertySupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
            fakeTestPeriodicWaveConstructorSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for verification support of the connect() method of an AudioNode throws', async () => {
        fakeTestAudioNodeConnectMethodVerificationSupport = () => {
            throw new Error('A fake error thrown by the test.');
        };

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferConstructorSupport,
            fakeTestAudioBufferCopyChannelMethodsOutOfBoundsSupport,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioBufferFactoryMethodSupport,
            fakeTestAudioBufferSourceNodeBufferReassignmentSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextGetOutputTimestampSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioContextResumeSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioParamValueSetterSupport,
            fakeTestAudioWorkletAddModuleMethodSupport,
            fakeTestAudioWorkletNodeConstructorSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestErrorEventErrorPropertySupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
            fakeTestPeriodicWaveConstructorSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for value setter support of an AudioParam fails', async () => {
        fakeTestAudioParamValueSetterSupport = () => Promise.resolve(false);

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferConstructorSupport,
            fakeTestAudioBufferCopyChannelMethodsOutOfBoundsSupport,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioBufferFactoryMethodSupport,
            fakeTestAudioBufferSourceNodeBufferReassignmentSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextGetOutputTimestampSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioContextResumeSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioParamValueSetterSupport,
            fakeTestAudioWorkletAddModuleMethodSupport,
            fakeTestAudioWorkletNodeConstructorSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestErrorEventErrorPropertySupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
            fakeTestPeriodicWaveConstructorSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for value setter support of an AudioParam throws', async () => {
        fakeTestAudioParamValueSetterSupport = () => Promise.rejcet(new Error('A fake error thrown by the test.'));

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferConstructorSupport,
            fakeTestAudioBufferCopyChannelMethodsOutOfBoundsSupport,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioBufferFactoryMethodSupport,
            fakeTestAudioBufferSourceNodeBufferReassignmentSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextGetOutputTimestampSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioContextResumeSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioParamValueSetterSupport,
            fakeTestAudioWorkletAddModuleMethodSupport,
            fakeTestAudioWorkletNodeConstructorSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestErrorEventErrorPropertySupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
            fakeTestPeriodicWaveConstructorSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for addModule() method support of an AudioWorklet fails', async () => {
        fakeTestAudioWorkletAddModuleMethodSupport = () => Promise.resolve(false);

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferConstructorSupport,
            fakeTestAudioBufferCopyChannelMethodsOutOfBoundsSupport,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioBufferFactoryMethodSupport,
            fakeTestAudioBufferSourceNodeBufferReassignmentSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextGetOutputTimestampSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioContextResumeSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioParamValueSetterSupport,
            fakeTestAudioWorkletAddModuleMethodSupport,
            fakeTestAudioWorkletNodeConstructorSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestErrorEventErrorPropertySupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
            fakeTestPeriodicWaveConstructorSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for addModule() method support of an AudioWorklet throws', async () => {
        fakeTestAudioWorkletAddModuleMethodSupport = () => Promise.rejcet(new Error('A fake error thrown by the test.'));

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferConstructorSupport,
            fakeTestAudioBufferCopyChannelMethodsOutOfBoundsSupport,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioBufferFactoryMethodSupport,
            fakeTestAudioBufferSourceNodeBufferReassignmentSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextGetOutputTimestampSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioContextResumeSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioParamValueSetterSupport,
            fakeTestAudioWorkletAddModuleMethodSupport,
            fakeTestAudioWorkletNodeConstructorSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestErrorEventErrorPropertySupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
            fakeTestPeriodicWaveConstructorSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for constructor support of an AudioWorkletNode fails', async () => {
        fakeTestAudioWorkletNodeConstructorSupport = () => false;

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferConstructorSupport,
            fakeTestAudioBufferCopyChannelMethodsOutOfBoundsSupport,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioBufferFactoryMethodSupport,
            fakeTestAudioBufferSourceNodeBufferReassignmentSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextGetOutputTimestampSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioContextResumeSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioParamValueSetterSupport,
            fakeTestAudioWorkletAddModuleMethodSupport,
            fakeTestAudioWorkletNodeConstructorSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestErrorEventErrorPropertySupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
            fakeTestPeriodicWaveConstructorSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for constructor support of an AudioWorkletNode throws', async () => {
        fakeTestAudioWorkletNodeConstructorSupport = () => {
            throw new Error('A fake error thrown by the test.');
        };

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferConstructorSupport,
            fakeTestAudioBufferCopyChannelMethodsOutOfBoundsSupport,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioBufferFactoryMethodSupport,
            fakeTestAudioBufferSourceNodeBufferReassignmentSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextGetOutputTimestampSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioContextResumeSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioParamValueSetterSupport,
            fakeTestAudioWorkletAddModuleMethodSupport,
            fakeTestAudioWorkletNodeConstructorSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestErrorEventErrorPropertySupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
            fakeTestPeriodicWaveConstructorSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for the maxValue and minValue support of an AudioParam of an AudioWorkletNode fails', async () => {
        fakeTestAudioWorkletProcessorNoInputsSupport = () => Promise.resolve(false);

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferConstructorSupport,
            fakeTestAudioBufferCopyChannelMethodsOutOfBoundsSupport,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioBufferFactoryMethodSupport,
            fakeTestAudioBufferSourceNodeBufferReassignmentSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextGetOutputTimestampSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioContextResumeSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioParamValueSetterSupport,
            fakeTestAudioWorkletAddModuleMethodSupport,
            fakeTestAudioWorkletNodeConstructorSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestErrorEventErrorPropertySupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
            fakeTestPeriodicWaveConstructorSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for the maxValue and minValue support of an AudioParam of an AudioWorkletNode throws', async () => {
        fakeTestAudioWorkletProcessorNoInputsSupport = () => Promise.rejcet(new Error('A fake error thrown by the test.'));

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferConstructorSupport,
            fakeTestAudioBufferCopyChannelMethodsOutOfBoundsSupport,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioBufferFactoryMethodSupport,
            fakeTestAudioBufferSourceNodeBufferReassignmentSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextGetOutputTimestampSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioContextResumeSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioParamValueSetterSupport,
            fakeTestAudioWorkletAddModuleMethodSupport,
            fakeTestAudioWorkletNodeConstructorSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestErrorEventErrorPropertySupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
            fakeTestPeriodicWaveConstructorSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for process support of an AudioWorkletProcessor fails', async () => {
        fakeTestAudioWorkletProcessorNoOutputsSupport = () => Promise.resolve(false);

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferConstructorSupport,
            fakeTestAudioBufferCopyChannelMethodsOutOfBoundsSupport,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioBufferFactoryMethodSupport,
            fakeTestAudioBufferSourceNodeBufferReassignmentSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextGetOutputTimestampSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioContextResumeSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioParamValueSetterSupport,
            fakeTestAudioWorkletAddModuleMethodSupport,
            fakeTestAudioWorkletNodeConstructorSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestErrorEventErrorPropertySupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
            fakeTestPeriodicWaveConstructorSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for process support of an AudioWorkletProcessor throws', async () => {
        fakeTestAudioWorkletProcessorNoOutputsSupport = () => Promise.rejcet(new Error('A fake error thrown by the test.'));

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferConstructorSupport,
            fakeTestAudioBufferCopyChannelMethodsOutOfBoundsSupport,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioBufferFactoryMethodSupport,
            fakeTestAudioBufferSourceNodeBufferReassignmentSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextGetOutputTimestampSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioContextResumeSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioParamValueSetterSupport,
            fakeTestAudioWorkletAddModuleMethodSupport,
            fakeTestAudioWorkletNodeConstructorSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestErrorEventErrorPropertySupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
            fakeTestPeriodicWaveConstructorSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for getFrequencyResponse support of a BiquadFilterNode fails', async () => {
        fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport = () => false;

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferConstructorSupport,
            fakeTestAudioBufferCopyChannelMethodsOutOfBoundsSupport,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioBufferFactoryMethodSupport,
            fakeTestAudioBufferSourceNodeBufferReassignmentSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextGetOutputTimestampSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioContextResumeSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioParamValueSetterSupport,
            fakeTestAudioWorkletAddModuleMethodSupport,
            fakeTestAudioWorkletNodeConstructorSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestErrorEventErrorPropertySupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
            fakeTestPeriodicWaveConstructorSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for getFrequencyResponse support of a BiquadFilterNode throws', async () => {
        fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport = () => {
            throw new Error('A fake error thrown by the test.');
        };

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferConstructorSupport,
            fakeTestAudioBufferCopyChannelMethodsOutOfBoundsSupport,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioBufferFactoryMethodSupport,
            fakeTestAudioBufferSourceNodeBufferReassignmentSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextGetOutputTimestampSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioContextResumeSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioParamValueSetterSupport,
            fakeTestAudioWorkletAddModuleMethodSupport,
            fakeTestAudioWorkletNodeConstructorSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestErrorEventErrorPropertySupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
            fakeTestPeriodicWaveConstructorSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for the channelCount property of a ChannelMergerNode fails', async () => {
        fakeTestChannelMergerNodeChannelCountSupport = () => false;

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferConstructorSupport,
            fakeTestAudioBufferCopyChannelMethodsOutOfBoundsSupport,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioBufferFactoryMethodSupport,
            fakeTestAudioBufferSourceNodeBufferReassignmentSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextGetOutputTimestampSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioContextResumeSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioParamValueSetterSupport,
            fakeTestAudioWorkletAddModuleMethodSupport,
            fakeTestAudioWorkletNodeConstructorSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestErrorEventErrorPropertySupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
            fakeTestPeriodicWaveConstructorSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for the channelCount property of a ChannelMergerNode throws', async () => {
        fakeTestChannelMergerNodeChannelCountSupport = () => {
            throw new Error('A fake error thrown by the test.');
        };

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferConstructorSupport,
            fakeTestAudioBufferCopyChannelMethodsOutOfBoundsSupport,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioBufferFactoryMethodSupport,
            fakeTestAudioBufferSourceNodeBufferReassignmentSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextGetOutputTimestampSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioContextResumeSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioParamValueSetterSupport,
            fakeTestAudioWorkletAddModuleMethodSupport,
            fakeTestAudioWorkletNodeConstructorSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestErrorEventErrorPropertySupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
            fakeTestPeriodicWaveConstructorSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for accurate scheduling support of a ConstantSourceNode fails', async () => {
        fakeTestConstantSourceNodeAccurateSchedulingSupport = () => false;

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferConstructorSupport,
            fakeTestAudioBufferCopyChannelMethodsOutOfBoundsSupport,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioBufferFactoryMethodSupport,
            fakeTestAudioBufferSourceNodeBufferReassignmentSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextGetOutputTimestampSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioContextResumeSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioParamValueSetterSupport,
            fakeTestAudioWorkletAddModuleMethodSupport,
            fakeTestAudioWorkletNodeConstructorSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestErrorEventErrorPropertySupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
            fakeTestPeriodicWaveConstructorSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for accurate scheduling support of a ConstantSourceNode throws', async () => {
        fakeTestConstantSourceNodeAccurateSchedulingSupport = () => {
            throw new Error('A fake error thrown by the test.');
        };

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferConstructorSupport,
            fakeTestAudioBufferCopyChannelMethodsOutOfBoundsSupport,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioBufferFactoryMethodSupport,
            fakeTestAudioBufferSourceNodeBufferReassignmentSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextGetOutputTimestampSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioContextResumeSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioParamValueSetterSupport,
            fakeTestAudioWorkletAddModuleMethodSupport,
            fakeTestAudioWorkletNodeConstructorSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestErrorEventErrorPropertySupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
            fakeTestPeriodicWaveConstructorSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for buffer reassignability support of a ConvolverNode fails', async () => {
        fakeTestConvolverNodeBufferReassignabilitySupport = () => false;

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferConstructorSupport,
            fakeTestAudioBufferCopyChannelMethodsOutOfBoundsSupport,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioBufferFactoryMethodSupport,
            fakeTestAudioBufferSourceNodeBufferReassignmentSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextGetOutputTimestampSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioContextResumeSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioParamValueSetterSupport,
            fakeTestAudioWorkletAddModuleMethodSupport,
            fakeTestAudioWorkletNodeConstructorSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestErrorEventErrorPropertySupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
            fakeTestPeriodicWaveConstructorSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for buffer reassignability support of a ConvolverNode throws', async () => {
        fakeTestConvolverNodeBufferReassignabilitySupport = () => {
            throw new Error('A fake error thrown by the test.');
        };

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferConstructorSupport,
            fakeTestAudioBufferCopyChannelMethodsOutOfBoundsSupport,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioBufferFactoryMethodSupport,
            fakeTestAudioBufferSourceNodeBufferReassignmentSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextGetOutputTimestampSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioContextResumeSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioParamValueSetterSupport,
            fakeTestAudioWorkletAddModuleMethodSupport,
            fakeTestAudioWorkletNodeConstructorSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestErrorEventErrorPropertySupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
            fakeTestPeriodicWaveConstructorSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for the channelCount property of a ConvolverNode fails', async () => {
        fakeTestConvolverNodeChannelCountSupport = () => false;

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferConstructorSupport,
            fakeTestAudioBufferCopyChannelMethodsOutOfBoundsSupport,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioBufferFactoryMethodSupport,
            fakeTestAudioBufferSourceNodeBufferReassignmentSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextGetOutputTimestampSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioContextResumeSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioParamValueSetterSupport,
            fakeTestAudioWorkletAddModuleMethodSupport,
            fakeTestAudioWorkletNodeConstructorSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestErrorEventErrorPropertySupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
            fakeTestPeriodicWaveConstructorSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for the channelCount property of a ConvolverNode throws', async () => {
        fakeTestConvolverNodeChannelCountSupport = () => {
            throw new Error('A fake error thrown by the test.');
        };

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferConstructorSupport,
            fakeTestAudioBufferCopyChannelMethodsOutOfBoundsSupport,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioBufferFactoryMethodSupport,
            fakeTestAudioBufferSourceNodeBufferReassignmentSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextGetOutputTimestampSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioContextResumeSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioParamValueSetterSupport,
            fakeTestAudioWorkletAddModuleMethodSupport,
            fakeTestAudioWorkletNodeConstructorSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestErrorEventErrorPropertySupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
            fakeTestPeriodicWaveConstructorSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for the DOMException constructor fails', async () => {
        fakeTestDomExceptionConstructorSupport = () => false;

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferConstructorSupport,
            fakeTestAudioBufferCopyChannelMethodsOutOfBoundsSupport,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioBufferFactoryMethodSupport,
            fakeTestAudioBufferSourceNodeBufferReassignmentSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextGetOutputTimestampSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioContextResumeSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioParamValueSetterSupport,
            fakeTestAudioWorkletAddModuleMethodSupport,
            fakeTestAudioWorkletNodeConstructorSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestErrorEventErrorPropertySupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
            fakeTestPeriodicWaveConstructorSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for the DOMException constructor throws', async () => {
        fakeTestDomExceptionConstructorSupport = () => {
            throw new Error('A fake error thrown by the test.');
        };

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferConstructorSupport,
            fakeTestAudioBufferCopyChannelMethodsOutOfBoundsSupport,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioBufferFactoryMethodSupport,
            fakeTestAudioBufferSourceNodeBufferReassignmentSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextGetOutputTimestampSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioContextResumeSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioParamValueSetterSupport,
            fakeTestAudioWorkletAddModuleMethodSupport,
            fakeTestAudioWorkletNodeConstructorSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestErrorEventErrorPropertySupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
            fakeTestPeriodicWaveConstructorSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for error property support of an ErrorEvent fails', async () => {
        fakeTestErrorEventErrorPropertySupport = () => false;

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferConstructorSupport,
            fakeTestAudioBufferCopyChannelMethodsOutOfBoundsSupport,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioBufferFactoryMethodSupport,
            fakeTestAudioBufferSourceNodeBufferReassignmentSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextGetOutputTimestampSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioContextResumeSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioParamValueSetterSupport,
            fakeTestAudioWorkletAddModuleMethodSupport,
            fakeTestAudioWorkletNodeConstructorSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestErrorEventErrorPropertySupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
            fakeTestPeriodicWaveConstructorSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for error property support of an ErrorEvent throws', async () => {
        fakeTestErrorEventErrorPropertySupport = () => {
            throw new Error('A fake error thrown by the test.');
        };

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferConstructorSupport,
            fakeTestAudioBufferCopyChannelMethodsOutOfBoundsSupport,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioBufferFactoryMethodSupport,
            fakeTestAudioBufferSourceNodeBufferReassignmentSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextGetOutputTimestampSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioContextResumeSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioParamValueSetterSupport,
            fakeTestAudioWorkletAddModuleMethodSupport,
            fakeTestAudioWorkletNodeConstructorSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestErrorEventErrorPropertySupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
            fakeTestPeriodicWaveConstructorSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for isSecureContext support fails', async () => {
        fakeTestIsSecureContextSupport = () => false;

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferConstructorSupport,
            fakeTestAudioBufferCopyChannelMethodsOutOfBoundsSupport,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioBufferFactoryMethodSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextGetOutputTimestampSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioContextResumeSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioParamValueSetterSupport,
            fakeTestAudioWorkletAddModuleMethodSupport,
            fakeTestAudioWorkletNodeConstructorSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestErrorEventErrorPropertySupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
            fakeTestPeriodicWaveConstructorSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for isSecureContext support throws', async () => {
        fakeTestIsSecureContextSupport = () => {
            throw new Error('A fake error thrown by the test.');
        };

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferConstructorSupport,
            fakeTestAudioBufferCopyChannelMethodsOutOfBoundsSupport,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioBufferFactoryMethodSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextGetOutputTimestampSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioContextResumeSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioParamValueSetterSupport,
            fakeTestAudioWorkletAddModuleMethodSupport,
            fakeTestAudioWorkletNodeConstructorSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestErrorEventErrorPropertySupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
            fakeTestPeriodicWaveConstructorSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for support for creating a MediaStreamAudioSourceNode with MediaStream without an audio track fails', async () => {
        fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport = () => false;

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferConstructorSupport,
            fakeTestAudioBufferCopyChannelMethodsOutOfBoundsSupport,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioBufferFactoryMethodSupport,
            fakeTestAudioBufferSourceNodeBufferReassignmentSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextGetOutputTimestampSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioContextResumeSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioParamValueSetterSupport,
            fakeTestAudioWorkletAddModuleMethodSupport,
            fakeTestAudioWorkletNodeConstructorSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestErrorEventErrorPropertySupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
            fakeTestPeriodicWaveConstructorSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for support for creating a MediaStreamAudioSourceNode with MediaStream without an audio track throws', async () => {
        fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport = () => {
            throw new Error('A fake error thrown by the test.');
        };

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferConstructorSupport,
            fakeTestAudioBufferCopyChannelMethodsOutOfBoundsSupport,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioBufferFactoryMethodSupport,
            fakeTestAudioBufferSourceNodeBufferReassignmentSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextGetOutputTimestampSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioContextResumeSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioParamValueSetterSupport,
            fakeTestAudioWorkletAddModuleMethodSupport,
            fakeTestAudioWorkletNodeConstructorSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestErrorEventErrorPropertySupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
            fakeTestPeriodicWaveConstructorSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for constructor support of a PeriodicWave fails', async () => {
        fakeTestPeriodicWaveConstructorSupport = () => false;

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferConstructorSupport,
            fakeTestAudioBufferCopyChannelMethodsOutOfBoundsSupport,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioBufferFactoryMethodSupport,
            fakeTestAudioBufferSourceNodeBufferReassignmentSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextGetOutputTimestampSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioContextResumeSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioParamValueSetterSupport,
            fakeTestAudioWorkletAddModuleMethodSupport,
            fakeTestAudioWorkletNodeConstructorSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestErrorEventErrorPropertySupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
            fakeTestPeriodicWaveConstructorSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for constructor support of a PeriodicWave throws', async () => {
        fakeTestPeriodicWaveConstructorSupport = () => {
            throw new Error('A fake error thrown by the test.');
        };

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferConstructorSupport,
            fakeTestAudioBufferCopyChannelMethodsOutOfBoundsSupport,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioBufferFactoryMethodSupport,
            fakeTestAudioBufferSourceNodeBufferReassignmentSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextGetOutputTimestampSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioContextResumeSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioParamValueSetterSupport,
            fakeTestAudioWorkletAddModuleMethodSupport,
            fakeTestAudioWorkletNodeConstructorSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestErrorEventErrorPropertySupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
            fakeTestPeriodicWaveConstructorSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for default value support of a StereoPannerNode fails', async () => {
        fakeTestStereoPannerNodeDefaultValueSupport = () => Promise.resolve(false);

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferConstructorSupport,
            fakeTestAudioBufferCopyChannelMethodsOutOfBoundsSupport,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioBufferFactoryMethodSupport,
            fakeTestAudioBufferSourceNodeBufferReassignmentSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextGetOutputTimestampSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioContextResumeSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioParamValueSetterSupport,
            fakeTestAudioWorkletAddModuleMethodSupport,
            fakeTestAudioWorkletNodeConstructorSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestErrorEventErrorPropertySupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
            fakeTestPeriodicWaveConstructorSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for default value support of a StereoPannerNode throws', async () => {
        fakeTestStereoPannerNodeDefaultValueSupport = () => Promise.reject(new Error('A fake error thrown by the test.'));

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferConstructorSupport,
            fakeTestAudioBufferCopyChannelMethodsOutOfBoundsSupport,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioBufferFactoryMethodSupport,
            fakeTestAudioBufferSourceNodeBufferReassignmentSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextGetOutputTimestampSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioContextResumeSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioParamValueSetterSupport,
            fakeTestAudioWorkletAddModuleMethodSupport,
            fakeTestAudioWorkletNodeConstructorSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestErrorEventErrorPropertySupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
            fakeTestPeriodicWaveConstructorSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for transferables support fails', async () => {
        fakeTestTransferablesSupport = () => Promise.resolve(false);

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferConstructorSupport,
            fakeTestAudioBufferCopyChannelMethodsOutOfBoundsSupport,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioBufferFactoryMethodSupport,
            fakeTestAudioBufferSourceNodeBufferReassignmentSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextGetOutputTimestampSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioContextResumeSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioParamValueSetterSupport,
            fakeTestAudioWorkletAddModuleMethodSupport,
            fakeTestAudioWorkletNodeConstructorSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestErrorEventErrorPropertySupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
            fakeTestPeriodicWaveConstructorSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for transferables support throws', async () => {
        fakeTestTransferablesSupport = () => Promise.reject(new Error('A fake error thrown by the test.'));

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferConstructorSupport,
            fakeTestAudioBufferCopyChannelMethodsOutOfBoundsSupport,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioBufferFactoryMethodSupport,
            fakeTestAudioBufferSourceNodeBufferReassignmentSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextGetOutputTimestampSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioContextResumeSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioParamValueSetterSupport,
            fakeTestAudioWorkletAddModuleMethodSupport,
            fakeTestAudioWorkletNodeConstructorSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestErrorEventErrorPropertySupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
            fakeTestPeriodicWaveConstructorSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });
});
