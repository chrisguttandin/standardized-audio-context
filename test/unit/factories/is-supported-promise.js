import { TEST_RESULTS } from '../../../src/globals';
import { createCacheTestResult } from '../../../src/factories/cache-test-result';
import { createIsSupportedPromise } from '../../../src/factories/is-supported-promise';

describe('createIsSupportedPromise()', () => {

    let cacheTestResult;
    let fakeTestAudioBufferCopyChannelMethodsSubarraySupport;
    let fakeTestAudioContextCloseMethodSupport;
    let fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport;
    let fakeTestAudioContextOptionsSupport;
    let fakeTestAudioNodeConnectMethodSupport;
    let fakeTestAudioWorkletProcessorNoOutputsSupport;
    let fakeTestConstantSourceNodeAccurateSchedulingSupport;
    let fakeTestConvolverNodeBufferReassignabilitySupport;
    let fakeTestIsSecureContextSupport;
    let fakeTestStereoPannerNodeDefaultValueSupport;
    let fakeTestTransferablesSupport;

    afterEach(() => {
        TEST_RESULTS.delete(fakeTestAudioBufferCopyChannelMethodsSubarraySupport);
        TEST_RESULTS.delete(fakeTestAudioContextCloseMethodSupport);
        TEST_RESULTS.delete(fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport);
        TEST_RESULTS.delete(fakeTestAudioContextOptionsSupport);
        TEST_RESULTS.delete(fakeTestAudioNodeConnectMethodSupport);
        TEST_RESULTS.delete(fakeTestAudioWorkletProcessorNoOutputsSupport);
        TEST_RESULTS.delete(fakeTestConstantSourceNodeAccurateSchedulingSupport);
        TEST_RESULTS.delete(fakeTestConvolverNodeBufferReassignabilitySupport);
        TEST_RESULTS.delete(fakeTestIsSecureContextSupport);
        TEST_RESULTS.delete(fakeTestStereoPannerNodeDefaultValueSupport);
        TEST_RESULTS.delete(fakeTestTransferablesSupport);
    });

    beforeEach(() => {
        cacheTestResult = createCacheTestResult(new Map());
        fakeTestAudioBufferCopyChannelMethodsSubarraySupport = () => true;
        fakeTestAudioContextCloseMethodSupport = () => true;
        fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport = () => Promise.resolve(true);
        fakeTestAudioContextOptionsSupport = () => true;
        fakeTestAudioNodeConnectMethodSupport = () => true;
        fakeTestAudioWorkletProcessorNoOutputsSupport = () => Promise.resolve(true);
        fakeTestConstantSourceNodeAccurateSchedulingSupport = () => true;
        fakeTestConvolverNodeBufferReassignabilitySupport = () => true;
        fakeTestIsSecureContextSupport = () => true;
        fakeTestStereoPannerNodeDefaultValueSupport = () => Promise.resolve(true);
        fakeTestTransferablesSupport = () => Promise.resolve(true);
    });

    it('should resolve to true if all test pass', async () => {
        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioNodeConnectMethodSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestIsSecureContextSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.true;
    });

    it('should resolve to false if the test for copyFromChannel and copyToChannel methods subarray support of an AudioBuffer fails', async () => {
        fakeTestAudioBufferCopyChannelMethodsSubarraySupport = () => false;

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioNodeConnectMethodSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestIsSecureContextSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for copyFromChannel and copyToChannel methods subarray support of an AudioBuffer throws', async () => {
        fakeTestAudioBufferCopyChannelMethodsSubarraySupport = () => { throw new Error('A fake error thrown by the test.'); };

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioNodeConnectMethodSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestIsSecureContextSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for close support fails', async () => {
        fakeTestAudioContextCloseMethodSupport = () => false;

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioNodeConnectMethodSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestIsSecureContextSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for close support throws', async () => {
        fakeTestAudioContextCloseMethodSupport = () => { throw new Error('A fake error thrown by the test.'); };

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioNodeConnectMethodSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestIsSecureContextSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for decodeAudioData TypeError support fails', async () => {
        fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport = () => Promise.resolve(false);

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioNodeConnectMethodSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestIsSecureContextSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for decodeAudioData TypeError support throws', async () => {
        fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport = () => Promise.reject(new Error('A fake error thrown by the test.'));

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioNodeConnectMethodSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestIsSecureContextSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for AudioContextOptions support fails', async () => {
        fakeTestAudioContextOptionsSupport = () => false;

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioNodeConnectMethodSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestIsSecureContextSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for AudioContextOptions support throws', async () => {
        fakeTestAudioContextOptionsSupport = () => { throw new Error('A fake error thrown by the test.'); };

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioNodeConnectMethodSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestIsSecureContextSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for connect support of an AudioNode fails', async () => {
        fakeTestAudioNodeConnectMethodSupport = () => false;

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioNodeConnectMethodSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestIsSecureContextSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for connect support of an AudioNode throws', async () => {
        fakeTestAudioNodeConnectMethodSupport = () => { throw new Error('A fake error thrown by the test.'); };

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioNodeConnectMethodSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestIsSecureContextSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for process support of an AudioWorkletProcessor fails', async () => {
        fakeTestAudioWorkletProcessorNoOutputsSupport = () => Promise.resolve(false);

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioNodeConnectMethodSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestIsSecureContextSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for process support of an AudioWorkletProcessor throws', async () => {
        fakeTestAudioWorkletProcessorNoOutputsSupport = () => Promise.rejcet(new Error('A fake error thrown by the test.'));

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioNodeConnectMethodSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestIsSecureContextSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for accurate scheduling support of a ConstantSourceNode fails', async () => {
        fakeTestConstantSourceNodeAccurateSchedulingSupport = () => false;

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioNodeConnectMethodSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestIsSecureContextSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for accurate scheduling support of a ConstantSourceNode throws', async () => {
        fakeTestConstantSourceNodeAccurateSchedulingSupport = () => { throw new Error('A fake error thrown by the test.'); };

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioNodeConnectMethodSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestIsSecureContextSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for buffer reassignability support of a ConvolverNode fails', async () => {
        fakeTestConvolverNodeBufferReassignabilitySupport = () => false;

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioNodeConnectMethodSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestIsSecureContextSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for buffer reassignability support of a ConvolverNode throws', async () => {
        fakeTestConvolverNodeBufferReassignabilitySupport = () => { throw new Error('A fake error thrown by the test.'); };

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioNodeConnectMethodSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestIsSecureContextSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for isSecureContext support fails', async () => {
        fakeTestIsSecureContextSupport = () => false;

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioNodeConnectMethodSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestIsSecureContextSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for isSecureContext support throws', async () => {
        fakeTestIsSecureContextSupport = () => { throw new Error('A fake error thrown by the test.'); };

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioNodeConnectMethodSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestIsSecureContextSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for default value support of a StereoPannerNode fails', async () => {
        fakeTestStereoPannerNodeDefaultValueSupport = () => Promise.resolve(false);

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioNodeConnectMethodSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestIsSecureContextSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for default value support of a StereoPannerNode throws', async () => {
        fakeTestStereoPannerNodeDefaultValueSupport = () => Promise.reject(new Error('A fake error thrown by the test.'));

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioNodeConnectMethodSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestIsSecureContextSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for transferables support fails', async () => {
        fakeTestTransferablesSupport = () => Promise.resolve(false);

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioNodeConnectMethodSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestIsSecureContextSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for transferables support throws', async () => {
        fakeTestTransferablesSupport = () => Promise.reject(new Error('A fake error thrown by the test.'));

        const isSupported = await createIsSupportedPromise(
            cacheTestResult,
            fakeTestAudioBufferCopyChannelMethodsSubarraySupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestAudioNodeConnectMethodSupport,
            fakeTestAudioWorkletProcessorNoOutputsSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestConvolverNodeBufferReassignabilitySupport,
            fakeTestIsSecureContextSupport,
            fakeTestStereoPannerNodeDefaultValueSupport,
            fakeTestTransferablesSupport
        );

        expect(isSupported).to.be.false;
    });

});
