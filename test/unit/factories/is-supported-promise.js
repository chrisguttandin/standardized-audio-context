import '../../helper/play-silence';
import { TEST_RESULTS } from '../../../src/globals';
import { createIsSupportedPromise } from '../../../src/factories/is-supported-promise';

describe('createIsSupportedPromise()', () => {

    let fakeBrowsernizr;
    let fakeTestAsyncArrayBufferSupport;
    let fakeTestAudioContextCloseMethodSupport;
    let fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport;
    let fakeTestAudioContextOptionsSupport;
    let fakeTestChannelMergerNodeSupport;
    let fakeTestChannelSplitterNodeChannelCountSupport;
    let fakeTestConstantSourceNodeAccurateSchedulingSupport;
    let fakeTestIsSecureContextSupport;
    let fakeTestStereoPannerNodeDefaultValueSupport;

    afterEach(() => {
        TEST_RESULTS.delete(fakeTestAsyncArrayBufferSupport);
        TEST_RESULTS.delete(fakeTestAudioContextCloseMethodSupport);
        TEST_RESULTS.delete(fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport);
        TEST_RESULTS.delete(fakeTestAudioContextOptionsSupport);
        TEST_RESULTS.delete(fakeTestChannelMergerNodeSupport);
        TEST_RESULTS.delete(fakeTestChannelSplitterNodeChannelCountSupport);
        TEST_RESULTS.delete(fakeTestConstantSourceNodeAccurateSchedulingSupport);
        TEST_RESULTS.delete(fakeTestIsSecureContextSupport);
        TEST_RESULTS.delete(fakeTestStereoPannerNodeDefaultValueSupport);
    });

    beforeEach(() => {
        fakeBrowsernizr = { promises: true, typedarrays: true, webaudio: true };
        fakeTestAsyncArrayBufferSupport = () => true;
        fakeTestAudioContextCloseMethodSupport = () => true;
        fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport = () => Promise.resolve(true);
        fakeTestAudioContextOptionsSupport = () => true;
        fakeTestChannelMergerNodeSupport = () => Promise.resolve(true);
        fakeTestChannelSplitterNodeChannelCountSupport = () => true;
        fakeTestConstantSourceNodeAccurateSchedulingSupport = () => true;
        fakeTestIsSecureContextSupport = () => true;
        fakeTestStereoPannerNodeDefaultValueSupport = () => Promise.resolve(true);
    });

    it('should resolve to true if all test pass', async () => {
        const isSupported = await createIsSupportedPromise(
            fakeBrowsernizr,
            fakeTestAsyncArrayBufferSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestChannelMergerNodeSupport,
            fakeTestChannelSplitterNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestIsSecureContextSupport,
            fakeTestStereoPannerNodeDefaultValueSupport
        );

        expect(isSupported).to.be.true;
    });

    it('should resolve to false if the test for promises fails', async () => {
        fakeBrowsernizr.promises = false;

        const isSupported = await createIsSupportedPromise(
            fakeBrowsernizr,
            fakeTestAsyncArrayBufferSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestChannelMergerNodeSupport,
            fakeTestChannelSplitterNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestIsSecureContextSupport,
            fakeTestStereoPannerNodeDefaultValueSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for typedarrays fails', async () => {
        fakeBrowsernizr.typedarrays = false;

        const isSupported = await createIsSupportedPromise(
            fakeBrowsernizr,
            fakeTestAsyncArrayBufferSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestChannelMergerNodeSupport,
            fakeTestChannelSplitterNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestIsSecureContextSupport,
            fakeTestStereoPannerNodeDefaultValueSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for webaudio fails', async () => {
        fakeBrowsernizr.webaudio = false;

        const isSupported = await createIsSupportedPromise(
            fakeBrowsernizr,
            fakeTestAsyncArrayBufferSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestChannelMergerNodeSupport,
            fakeTestChannelSplitterNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestIsSecureContextSupport,
            fakeTestStereoPannerNodeDefaultValueSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for async-array-buffer support fails', async () => {
        fakeTestAsyncArrayBufferSupport = () => false;

        const isSupported = await createIsSupportedPromise(
            fakeBrowsernizr,
            fakeTestAsyncArrayBufferSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestChannelMergerNodeSupport,
            fakeTestChannelSplitterNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestIsSecureContextSupport,
            fakeTestStereoPannerNodeDefaultValueSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for close support fails', async () => {
        fakeTestAudioContextCloseMethodSupport = () => false;

        const isSupported = await createIsSupportedPromise(
            fakeBrowsernizr,
            fakeTestAsyncArrayBufferSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestChannelMergerNodeSupport,
            fakeTestChannelSplitterNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestIsSecureContextSupport,
            fakeTestStereoPannerNodeDefaultValueSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for decodeAudioData TypeError support fails', async () => {
        fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport = () => Promise.resolve(false);

        const isSupported = await createIsSupportedPromise(
            fakeBrowsernizr,
            fakeTestAsyncArrayBufferSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestChannelMergerNodeSupport,
            fakeTestChannelSplitterNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestIsSecureContextSupport,
            fakeTestStereoPannerNodeDefaultValueSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for AudioContextOptions support fails', async () => {
        fakeTestAudioContextOptionsSupport = () => false;

        const isSupported = await createIsSupportedPromise(
            fakeBrowsernizr,
            fakeTestAsyncArrayBufferSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestChannelMergerNodeSupport,
            fakeTestChannelSplitterNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestIsSecureContextSupport,
            fakeTestStereoPannerNodeDefaultValueSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for ChannelMergerNode support fails', async () => {
        fakeTestChannelMergerNodeSupport = () => Promise.resolve(false);

        const isSupported = await createIsSupportedPromise(
            fakeBrowsernizr,
            fakeTestAsyncArrayBufferSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestChannelMergerNodeSupport,
            fakeTestChannelSplitterNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestIsSecureContextSupport,
            fakeTestStereoPannerNodeDefaultValueSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for ChannelSplitterNode channelCount support fails', async () => {
        fakeTestChannelSplitterNodeChannelCountSupport = () => false;

        const isSupported = await createIsSupportedPromise(
            fakeBrowsernizr,
            fakeTestAsyncArrayBufferSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestChannelMergerNodeSupport,
            fakeTestChannelSplitterNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestIsSecureContextSupport,
            fakeTestStereoPannerNodeDefaultValueSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for accurate scheduling of a ConstantSourceNode support fails', async () => {
        fakeTestConstantSourceNodeAccurateSchedulingSupport = () => false;

        const isSupported = await createIsSupportedPromise(
            fakeBrowsernizr,
            fakeTestAsyncArrayBufferSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestChannelMergerNodeSupport,
            fakeTestChannelSplitterNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestIsSecureContextSupport,
            fakeTestStereoPannerNodeDefaultValueSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for isSecureContext support fails', async () => {
        fakeTestIsSecureContextSupport = () => false;

        const isSupported = await createIsSupportedPromise(
            fakeBrowsernizr,
            fakeTestAsyncArrayBufferSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestChannelMergerNodeSupport,
            fakeTestChannelSplitterNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestIsSecureContextSupport,
            fakeTestStereoPannerNodeDefaultValueSupport
        );

        expect(isSupported).to.be.false;
    });

    it('should resolve to false if the test for default value support of a StereoPannerNode fails', async () => {
        fakeTestConstantSourceNodeAccurateSchedulingSupport = () => false;

        const isSupported = await createIsSupportedPromise(
            fakeBrowsernizr,
            fakeTestAsyncArrayBufferSupport,
            fakeTestAudioContextCloseMethodSupport,
            fakeTestAudioContextDecodeAudioDataMethodTypeErrorSupport,
            fakeTestAudioContextOptionsSupport,
            fakeTestChannelMergerNodeSupport,
            fakeTestChannelSplitterNodeChannelCountSupport,
            fakeTestConstantSourceNodeAccurateSchedulingSupport,
            fakeTestIsSecureContextSupport,
            fakeTestStereoPannerNodeDefaultValueSupport
        );

        expect(isSupported).to.be.false;
    });

});
