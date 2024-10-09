import { createCacheTestResult } from '../../../src/factories/cache-test-result';
import { createIsSupportedPromise } from '../../../src/factories/is-supported-promise';

describe('createIsSupportedPromise()', () => {
    let cacheTestResult;
    let fakeTestAudioBufferConstructorSupport;
    let fakeTestAudioBufferCopyChannelMethodsSubarraySupport;
    let fakeTestAudioContextCloseMethodSupport;
    let fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport;
    let fakeTestAudioContextOptionsSupport;
    let fakeTestAudioNodeConnectMethodChainabilitySupport;
    let fakeTestAudioNodeConnectMethodVerificationSupport;
    let fakeTestAudioWorkletProcessorNoInputsSupport;
    let fakeTestAudioWorkletProcessorNoOutputsSupport;
    let fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport;
    let fakeTestChannelMergerNodeChannelCountSupport;
    let fakeTestConstantSourceNodeAccurateSchedulingSupport;
    let fakeTestConvolverNodeBufferReassignabilitySupport;
    let fakeTestConvolverNodeChannelCountSupport;
    let fakeTestDomExceptionConstructorSupport;
    let fakeTestIsSecureContextSupport;
    let fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport;
    let fakeTestStereoPannerNodeDefaultValueSupport;
    let fakeTestTransferablesSupport;

    beforeEach(() => {
        cacheTestResult = createCacheTestResult(new Map(), new WeakMap());
        fakeTestAudioBufferConstructorSupport = () => true;
        fakeTestAudioBufferCopyChannelMethodsSubarraySupport = () => true;
        fakeTestAudioContextCloseMethodSupport = () => true;
        fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport = () => Promise.resolve(true);
        fakeTestAudioContextOptionsSupport = () => true;
        fakeTestAudioNodeConnectMethodChainabilitySupport = () => true;
        fakeTestAudioNodeConnectMethodVerificationSupport = () => true;
        fakeTestAudioWorkletProcessorNoInputsSupport = () => Promise.resolve(true);
        fakeTestAudioWorkletProcessorNoOutputsSupport = () => Promise.resolve(true);
        fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport = () => true;
        fakeTestChannelMergerNodeChannelCountSupport = () => true;
        fakeTestConstantSourceNodeAccurateSchedulingSupport = () => true;
        fakeTestConvolverNodeBufferReassignabilitySupport = () => true;
        fakeTestConvolverNodeChannelCountSupport = () => true;
        fakeTestDomExceptionConstructorSupport = () => true;
        fakeTestIsSecureContextSupport = () => true;
        fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport = () => true;
        fakeTestStereoPannerNodeDefaultValueSupport = () => Promise.resolve(true);
        fakeTestTransferablesSupport = () => Promise.resolve(true);
    });

    it('should resolve to true if all test pass', async () => {
        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferConstructorSupport,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
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
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
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
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
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
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
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
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
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
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
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
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
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
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
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
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
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
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
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
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
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
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
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
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
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
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
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
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for the maxValue and minValue support of an AudioParam an AudioWorkletNode fails', async () => {
        fakeTestAudioWorkletProcessorNoInputsSupport = () => Promise.resolve(false);

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferConstructorSupport,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
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
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
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
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
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
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
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
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
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
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
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
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
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
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
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
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
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
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
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
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
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
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
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
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
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
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
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
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
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
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
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
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
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
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
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
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
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
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
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
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
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
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
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
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
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
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioNodeConnectMethodChainabilitySupport,
            fakeTestAudioNodeConnectMethodVerificationSupport,
            fakeTestAudioWorkletProcessorNoInputsSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestBiquadFilterNodeGetFrequencyResponseMethodSupport,
            fakeTestChannelMergerNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestConvolverNodeChannelCountSupport,
            fakeTestDomExceptionConstructorSupport,
            fakeTestIsSecureContextSupport,
            fakeTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });
});
