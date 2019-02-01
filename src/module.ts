import browsernizr from './browsernizr';
import { createAbortError } from './factories/abort-error';
import { createAddAudioWorkletModule } from './factories/add-audio-worklet-module';
import { createAnalyserNodeConstructor } from './factories/analyser-node-constructor';
import { createAnalyserNodeRendererFactory } from './factories/analyser-node-renderer-factory';
import { createAudioBufferConstructor } from './factories/audio-buffer-constructor';
import { createAudioBufferSourceNodeConstructor } from './factories/audio-buffer-source-node-constructor';
import { createAudioBufferSourceNodeRendererFactory } from './factories/audio-buffer-source-node-renderer-factory';
import { createAudioContextConstructor } from './factories/audio-context-constructor';
import { createAudioDestinationNodeConstructor } from './factories/audio-destination-node-constructor';
import { createAudioDestinationNodeRenderer } from './factories/audio-destination-node-renderer-factory';
import { createAudioListenerFactory } from './factories/audio-listener-factory';
import { createAudioNodeConstructor } from './factories/audio-node-constructor';
import { createAudioParamFactory } from './factories/audio-param-factory';
import { createAudioParamRenderer } from './factories/audio-param-renderer';
import { createAudioWorkletNodeConstructor } from './factories/audio-worklet-node-constructor';
import { createAudioWorkletNodeRendererFactory } from './factories/audio-worklet-node-renderer-factory';
import { createBaseAudioContextConstructor } from './factories/base-audio-context-constructor';
import { createBiquadFilterNodeConstructor } from './factories/biquad-filter-node-constructor';
import { createBiquadFilterNodeRendererFactory } from './factories/biquad-filter-node-renderer-factory';
import { createChannelMergerNodeConstructor } from './factories/channel-merger-node-constructor';
import { createChannelMergerNodeRendererFactory } from './factories/channel-merger-node-renderer-factory';
import { createChannelSplitterNodeConstructor } from './factories/channel-splitter-node-constructor';
import { createChannelSplitterNodeRendererFactory } from './factories/channel-splitter-node-renderer-factory';
import { createConnectMultipleOutputs } from './factories/connect-multiple-outputs';
import { createConstantSourceNodeConstructor } from './factories/constant-source-node-constructor';
import { createConstantSourceNodeRendererFactory } from './factories/constant-source-node-renderer-factory';
import { createConvolverNodeConstructor } from './factories/convolver-node-constructor';
import { createConvolverNodeRendererFactory } from './factories/convolver-node-renderer-factory';
import { createDataCloneError } from './factories/data-clone-error';
import { createDecodeAudioData } from './factories/decode-audio-data';
import { createDelayNodeConstructor } from './factories/delay-node-constructor';
import { createDelayNodeRendererFactory } from './factories/delay-node-renderer-factory';
import { createDisconnectMultipleOutputs } from './factories/disconnect-multiple-outputs';
import { createDynamicsCompressorNodeConstructor } from './factories/dynamics-compressor-node-constructor';
import { createDynamicsCompressorNodeRendererFactory } from './factories/dynamics-compressor-node-renderer-factory';
import { createEncodingError } from './factories/encoding-error';
import { createFetchSource } from './factories/fetch-source';
import { createGainNodeConstructor } from './factories/gain-node-constructor';
import { createGainNodeRendererFactory } from './factories/gain-node-renderer-factory';
import { createGetBackupNativeContext } from './factories/get-backup-native-context';
import { createIIRFilterNodeConstructor } from './factories/iir-filter-node-constructor';
import { createIIRFilterNodeRendererFactory } from './factories/iir-filter-node-renderer-factory';
import { createIndexSizeError } from './factories/index-size-error';
import { createInvalidAccessError } from './factories/invalid-access-error';
import { createInvalidStateError } from './factories/invalid-state-error';
import { createIsNativeContext } from './factories/is-native-context';
import { createIsNativeOfflineAudioContext } from './factories/is-native-offline-audio-context';
import { createIsSecureContext } from './factories/is-secure-context';
import { createIsSupportedPromise } from './factories/is-supported-promise';
import { createMediaElementAudioSourceNodeConstructor } from './factories/media-element-audio-source-node-constructor';
import { createMediaStreamAudioSourceNodeConstructor } from './factories/media-stream-audio-source-node-constructor';
import { createMinimalAudioContextConstructor } from './factories/minimal-audio-context-constructor';
import { createMinimalBaseAudioContextConstructor } from './factories/minimal-base-audio-context-constructor';
import { createMinimalOfflineAudioContextConstructor } from './factories/minimal-offline-audio-context-constructor';
import { createNativeAnalyserNodeFactory } from './factories/native-analyser-node-factory';
import { createNativeAudioBufferConstructor } from './factories/native-audio-buffer-constructor';
import { createNativeAudioBufferSourceNodeFactory } from './factories/native-audio-buffer-source-node-factory';
import { createNativeAudioContextConstructor } from './factories/native-audio-context-constructor';
import { createNativeAudioDestinationNode } from './factories/native-audio-destination-node';
import { createNativeAudioNodeFactory } from './factories/native-audio-node-factory';
import { createNativeAudioWorkletNodeConstructor } from './factories/native-audio-worklet-node-constructor';
import { createNativeAudioWorkletNodeFactory } from './factories/native-audio-worklet-node-factory';
import { createNativeAudioWorkletNodeFakerFactory } from './factories/native-audio-worklet-node-faker-factory';
import { createNativeBiquadFilterNodeFactory } from './factories/native-biquad-filter-node-factory';
import { createNativeChannelMergerNodeFactory } from './factories/native-channel-merger-node-factory';
import { createNativeChannelSplitterNodeFactory } from './factories/native-channel-splitter-node-factory';
import { createNativeConstantSourceNodeFactory } from './factories/native-constant-source-node-factory';
import { createNativeConstantSourceNodeFakerFactory } from './factories/native-constant-source-node-faker-factory';
import { createNativeConvolverNodeFactory } from './factories/native-convolver-node-factory';
import { createNativeConvolverNodeFakerFactory } from './factories/native-convolver-node-faker-factory';
import { createNativeDelayNodeFactory } from './factories/native-delay-node-factory';
import { createNativeDynamicsCompressorNodeFactory } from './factories/native-dynamics-compressor-node-factory';
import { createNativeGainNodeFactory } from './factories/native-gain-node-factory';
import { createNativeIIRFilterNodeFactory } from './factories/native-iir-filter-node-factory';
import { createNativeIIRFilterNodeFakerFactory } from './factories/native-iir-filter-node-faker-factory';
import { createNativeMediaElementAudioSourceNodeFactory } from './factories/native-media-element-audio-source-node-factory';
import { createNativeMediaStreamAudioSourceNodeFactory } from './factories/native-media-stream-audio-source-node-factory';
import { createNativeOfflineAudioContextConstructor } from './factories/native-offline-audio-context-constructor';
import { createNativeOscillatorNodeFactory } from './factories/native-oscillator-node-factory';
import { createNativePannerNodeFactory } from './factories/native-panner-node-factory';
import { createNativePannerNodeFakerFactory } from './factories/native-panner-node-faker-factory';
import { createNativePeriodicWaveFactory } from './factories/native-periodic-wave-factory';
import { createNativeScriptProcessorNodeFactory } from './factories/native-script-processor-node-factory';
import { createNativeStereoPannerNodeFactory } from './factories/native-stereo-panner-node-factory';
import { createNativeStereoPannerNodeFakerFactory } from './factories/native-stereo-panner-node-faker-factory';
import { createNativeWaveShaperNodeFactory } from './factories/native-wave-shaper-node-factory';
import { createNativeWaveShaperNodeFakerFactory } from './factories/native-wave-shaper-node-faker-factory';
import { createNoneAudioDestinationNodeConstructor } from './factories/none-audio-destination-node-constructor';
import { createNotSupportedError } from './factories/not-supported-error';
import { createOfflineAudioContextConstructor } from './factories/offline-audio-context-constructor';
import { createOscillatorNodeConstructor } from './factories/oscillator-node-constructor';
import { createOscillatorNodeRendererFactory } from './factories/oscillator-node-renderer-factory';
import { createPannerNodeConstructor } from './factories/panner-node-constructor';
import { createPannerNodeRendererFactory } from './factories/panner-node-renderer-factory';
import { createPeriodicWaveConstructor } from './factories/periodic-wave-constructor';
import { createRenderNativeOfflineAudioContext } from './factories/render-native-offline-audio-context';
import { createStartRendering } from './factories/start-rendering';
import { createStereoPannerNodeConstructor } from './factories/stereo-panner-node-constructor';
import { createStereoPannerNodeRendererFactory } from './factories/stereo-panner-node-renderer-factory';
import { createTestAudioBufferConstructorSupport } from './factories/test-audio-buffer-constructor-support';
import {
    createTestAudioBufferSourceNodeStartMethodConsecutiveCallsSupport
} from './factories/test-audio-buffer-source-node-start-method-consecutive-calls-support';
import {
    createTestAudioBufferSourceNodeStartMethodDurationParameterSupport
} from './factories/test-audio-buffer-source-node-start-method-duration-parameter-support';
import { createTestAudioContextCloseMethodSupport } from './factories/test-audio-context-close-method-support';
import {
    createTestAudioContextDecodeAudioDataMethodTypeErrorSupport
} from './factories/test-audio-context-decode-audio-data-method-type-error-support';
import { createTestAudioContextOptionsSupport } from './factories/test-audio-context-options-support';
import {
    createTestAudioScheduledSourceNodeStartMethodNegativeParametersSupport
} from './factories/test-audio-scheduled-source-node-start-method-negative-parameters-support';
import {
    createTestAudioScheduledSourceNodeStopMethodConsecutiveCallsSupport
} from './factories/test-audio-scheduled-source-node-stop-method-consecutive-calls-support';
import {
    createTestAudioScheduledSourceNodeStopMethodNegativeParametersSupport
} from './factories/test-audio-scheduled-source-node-stop-method-negative-parameters-support';
import { createTestChannelMergerNodeSupport } from './factories/test-channel-merger-node-support';
import { createTestChannelSplitterNodeChannelCountSupport } from './factories/test-channel-splitter-node-channel-count-support';
import {
    createTestConstantSourceNodeAccurateSchedulingSupport
} from './factories/test-constant-source-node-accurate-scheduling-support';
import { createTestConvolverNodeBufferReassignabilitySupport } from './factories/test-convolver-node-buffer-reassignability-support';
import { createTestIsSecureContextSupport } from './factories/test-is-secure-context-support';
import { createTestStereoPannerNodeDefaultValueSupport } from './factories/test-stereo-panner-node-default-value-support';
import { createUnknownError } from './factories/unknown-error';
import { createWaveShaperNodeConstructor } from './factories/wave-shaper-node-constructor';
import { createWaveShaperNodeRendererFactory } from './factories/wave-shaper-node-renderer-factory';
import { createWindow } from './factories/window';
import {
    createWrapAudioScheduledSourceNodeStopMethodConsecutiveCalls
} from './factories/wrap-audio-scheduled-source-node-stop-method-consecutive-calls';
import { createWrapChannelMergerNode } from './factories/wrap-channel-merger-node';
import {
    IAnalyserNode,
    IAudioBuffer,
    IAudioBufferSourceNode,
    IAudioContext,
    IAudioNode,
    IAudioWorkletNode,
    IBiquadFilterNode,
    IConstantSourceNode,
    IConvolverNode,
    IDelayNode,
    IDynamicsCompressorNode,
    IGainNode,
    IIIRFilterNode,
    IMediaElementAudioSourceNode,
    IMediaStreamAudioSourceNode,
    IMinimalAudioContext,
    IMinimalOfflineAudioContext,
    IOfflineAudioContext,
    IOfflineAudioContextConstructor,
    IOscillatorNode,
    IPannerNode,
    IPeriodicWave,
    IStereoPannerNode,
    IWaveShaperNode
} from './interfaces';
import { testAudioBufferCopyChannelMethodsSubarraySupport } from './support-testers/audio-buffer-copy-channel-methods-subarray';
import { testPromiseSupport } from './support-testers/promise';
import { testTransferablesSupport } from './support-testers/transferables';
import {
    TAddAudioWorkletModuleFunction,
    TAnalyserNodeConstructor,
    TAudioBufferConstructor,
    TAudioBufferSourceNodeConstructor,
    TAudioContextConstructor,
    TAudioWorkletNodeConstructor,
    TBiquadFilterNodeConstructor,
    TChannelMergerNodeConstructor,
    TChannelSplitterNodeConstructor,
    TConstantSourceNodeConstructor,
    TConvolverNodeConstructor,
    TDecodeAudioDataFunction,
    TDelayNodeConstructor,
    TDynamicsCompressorNodeConstructor,
    TGainNodeConstructor,
    TIIRFilterNodeConstructor,
    TMediaElementAudioSourceNodeConstructor,
    TMediaStreamAudioSourceNodeConstructor,
    TMinimalAudioContextConstructor,
    TMinimalOfflineAudioContextConstructor,
    TOscillatorNodeConstructor,
    TPannerNodeConstructor,
    TPeriodicWaveConstructor,
    TStereoPannerNodeConstructor,
    TWaveShaperNodeConstructor
} from './types';

export * from './interfaces';
export * from './types';

const window = createWindow();
const nativeOfflineAudioContextConstructor = createNativeOfflineAudioContextConstructor(window);
const isNativeOfflineAudioContext = createIsNativeOfflineAudioContext(nativeOfflineAudioContextConstructor);
const nativeAudioContextConstructor = createNativeAudioContextConstructor(window);
const getBackupNativeContext = createGetBackupNativeContext(
    isNativeOfflineAudioContext,
    nativeAudioContextConstructor,
    nativeOfflineAudioContextConstructor
);
const createNativeAudioNode = createNativeAudioNodeFactory(getBackupNativeContext);
const createNativeAnalyserNode = createNativeAnalyserNodeFactory(createIndexSizeError, createNativeAudioNode);
const createAnalyserNodeRenderer = createAnalyserNodeRendererFactory(createNativeAnalyserNode);
const audioNodeConstructor = createAudioNodeConstructor(createInvalidAccessError, isNativeOfflineAudioContext);
const noneAudioDestinationNodeConstructor = createNoneAudioDestinationNodeConstructor(audioNodeConstructor);
const analyserNodeConstructor: TAnalyserNodeConstructor = createAnalyserNodeConstructor(
    createAnalyserNodeRenderer,
    createIndexSizeError,
    createNativeAnalyserNode,
    isNativeOfflineAudioContext,
    noneAudioDestinationNodeConstructor
);

type analyserNodeConstructor = IAnalyserNode;

export { analyserNodeConstructor as AnalyserNode };

const nativeAudioBufferConstructor = createNativeAudioBufferConstructor(window);

const audioBufferConstructor: TAudioBufferConstructor = createAudioBufferConstructor(
    createNotSupportedError,
    nativeAudioBufferConstructor,
    nativeOfflineAudioContextConstructor,
    createTestAudioBufferConstructorSupport(nativeAudioBufferConstructor)
);

type audioBufferConstructor = IAudioBuffer;

export { audioBufferConstructor as AudioBuffer };

const testAudioScheduledSourceNodeStartMethodNegativeParametersSupport =
    createTestAudioScheduledSourceNodeStartMethodNegativeParametersSupport(createNativeAudioNode);
const testAudioScheduledSourceNodeStopMethodConsecutiveCallsSupport =
    createTestAudioScheduledSourceNodeStopMethodConsecutiveCallsSupport(createNativeAudioNode);
const testAudioScheduledSourceNodeStopMethodNegativeParametersSupport =
    createTestAudioScheduledSourceNodeStopMethodNegativeParametersSupport(createNativeAudioNode);
const wrapAudioScheduledSourceNodeStopMethodConsecutiveCalls = createWrapAudioScheduledSourceNodeStopMethodConsecutiveCalls(
    createNativeAudioNode
);
const createNativeAudioBufferSourceNode = createNativeAudioBufferSourceNodeFactory(
    createNativeAudioNode,
    createTestAudioBufferSourceNodeStartMethodConsecutiveCallsSupport(createNativeAudioNode),
    createTestAudioBufferSourceNodeStartMethodDurationParameterSupport(nativeOfflineAudioContextConstructor),
    testAudioScheduledSourceNodeStartMethodNegativeParametersSupport,
    testAudioScheduledSourceNodeStopMethodConsecutiveCallsSupport,
    testAudioScheduledSourceNodeStopMethodNegativeParametersSupport,
    wrapAudioScheduledSourceNodeStopMethodConsecutiveCalls
);
const createAudioBufferSourceNodeRenderer = createAudioBufferSourceNodeRendererFactory(createNativeAudioBufferSourceNode);
const createAudioParam = createAudioParamFactory(createAudioParamRenderer);
const audioBufferSourceNodeConstructor: TAudioBufferSourceNodeConstructor = createAudioBufferSourceNodeConstructor(
    createAudioBufferSourceNodeRenderer,
    createAudioParam,
    createInvalidStateError,
    createNativeAudioBufferSourceNode,
    isNativeOfflineAudioContext,
    noneAudioDestinationNodeConstructor
);

type audioBufferSourceNodeConstructor = IAudioBufferSourceNode;

export { audioBufferSourceNodeConstructor as AudioBufferSourceNode };

const audioDestinationNodeConstructor = createAudioDestinationNodeConstructor(
    audioNodeConstructor,
    createAudioDestinationNodeRenderer,
    createIndexSizeError,
    createInvalidStateError,
    createNativeAudioDestinationNode,
    isNativeOfflineAudioContext
);
const createNativeBiquadFilterNode = createNativeBiquadFilterNodeFactory(createNativeAudioNode);
const createBiquadFilterNodeRenderer = createBiquadFilterNodeRendererFactory(createNativeBiquadFilterNode);
const biquadFilterNodeConstructor: TBiquadFilterNodeConstructor = createBiquadFilterNodeConstructor(
    createAudioParam,
    createBiquadFilterNodeRenderer,
    createInvalidAccessError,
    createNativeBiquadFilterNode,
    isNativeOfflineAudioContext,
    noneAudioDestinationNodeConstructor
);
const wrapChannelMergerNode = createWrapChannelMergerNode(createInvalidStateError, createNativeAudioNode);
const createNativeChannelMergerNode = createNativeChannelMergerNodeFactory(createNativeAudioNode, wrapChannelMergerNode);
const createChannelMergerNodeRenderer = createChannelMergerNodeRendererFactory(createNativeChannelMergerNode);
const channelMergerNodeConstructor: TChannelMergerNodeConstructor = createChannelMergerNodeConstructor(
    createChannelMergerNodeRenderer,
    createNativeChannelMergerNode,
    isNativeOfflineAudioContext,
    noneAudioDestinationNodeConstructor
);
const createNativeChannelSplitterNode = createNativeChannelSplitterNodeFactory(createNativeAudioNode);
const createChannelSplitterNodeRenderer = createChannelSplitterNodeRendererFactory(createNativeChannelSplitterNode);
const channelSplitterNodeConstructor: TChannelSplitterNodeConstructor = createChannelSplitterNodeConstructor(
    createChannelSplitterNodeRenderer,
    createNativeChannelSplitterNode,
    isNativeOfflineAudioContext,
    noneAudioDestinationNodeConstructor
);
const createNativeGainNode = createNativeGainNodeFactory(createNativeAudioNode);
const createNativeConstantSourceNodeFaker = createNativeConstantSourceNodeFakerFactory(
    createNativeAudioBufferSourceNode,
    createNativeGainNode
);
const createNativeConstantSourceNode = createNativeConstantSourceNodeFactory(
    createNativeAudioNode,
    createNativeConstantSourceNodeFaker,
    testAudioScheduledSourceNodeStartMethodNegativeParametersSupport,
    testAudioScheduledSourceNodeStopMethodNegativeParametersSupport
);
const createConstantSourceNodeRenderer = createConstantSourceNodeRendererFactory(createNativeConstantSourceNode);
const constantSourceNodeConstructor: TConstantSourceNodeConstructor = createConstantSourceNodeConstructor(
    createAudioParam,
    createConstantSourceNodeRenderer,
    createNativeConstantSourceNode,
    isNativeOfflineAudioContext,
    noneAudioDestinationNodeConstructor
);
const createNativeConvolverNodeFaker = createNativeConvolverNodeFakerFactory(createNativeAudioNode, createNativeGainNode);
const testConvolverNodeBufferReassignabilitySupport = createTestConvolverNodeBufferReassignabilitySupport(createNativeAudioNode);
const createNativeConvolverNode = createNativeConvolverNodeFactory(
    createNativeAudioNode,
    createNativeConvolverNodeFaker,
    createNotSupportedError,
    testConvolverNodeBufferReassignabilitySupport
);
const createConvolverNodeRenderer = createConvolverNodeRendererFactory(createNativeConvolverNode);
const convolverNodeConstructor: TConvolverNodeConstructor = createConvolverNodeConstructor(
    createConvolverNodeRenderer,
    createNativeConvolverNode,
    isNativeOfflineAudioContext,
    noneAudioDestinationNodeConstructor
);
const createNativeDelayNode = createNativeDelayNodeFactory(createNativeAudioNode);
const createDelayNodeRenderer = createDelayNodeRendererFactory(createNativeDelayNode);
const delayNodeConstructor: TDelayNodeConstructor = createDelayNodeConstructor(
    createAudioParam,
    createDelayNodeRenderer,
    createNativeDelayNode,
    isNativeOfflineAudioContext,
    noneAudioDestinationNodeConstructor
);
const createNativeDynamicsCompressorNode = createNativeDynamicsCompressorNodeFactory(createNativeAudioNode, createNotSupportedError);
const createDynamicsCompressorNodeRenderer = createDynamicsCompressorNodeRendererFactory(createNativeDynamicsCompressorNode);
const dynamicsCompressorNodeConstructor: TDynamicsCompressorNodeConstructor = createDynamicsCompressorNodeConstructor(
    createAudioParam,
    createDynamicsCompressorNodeRenderer,
    createNativeDynamicsCompressorNode,
    createNotSupportedError,
    isNativeOfflineAudioContext,
    noneAudioDestinationNodeConstructor
);
const createGainNodeRenderer = createGainNodeRendererFactory(createNativeGainNode);
const gainNodeConstructor: TGainNodeConstructor = createGainNodeConstructor(
    createAudioParam,
    createGainNodeRenderer,
    createNativeGainNode,
    isNativeOfflineAudioContext,
    noneAudioDestinationNodeConstructor
);
const createNativeScriptProcessorNode = createNativeScriptProcessorNodeFactory(createNativeAudioNode);
const createNativeIIRFilterNodeFaker = createNativeIIRFilterNodeFakerFactory(
    createInvalidAccessError,
    createInvalidStateError,
    createNativeScriptProcessorNode,
    createNotSupportedError
);
const renderNativeOfflineAudioContext = createRenderNativeOfflineAudioContext(createNativeGainNode);
const createIIRFilterNodeRenderer = createIIRFilterNodeRendererFactory(
    createNativeAudioBufferSourceNode,
    createNativeAudioNode,
    nativeOfflineAudioContextConstructor,
    renderNativeOfflineAudioContext
);
const createNativeIIRFilterNode = createNativeIIRFilterNodeFactory(createNativeAudioNode, createNativeIIRFilterNodeFaker);
const iIRFilterNodeConstructor: TIIRFilterNodeConstructor = createIIRFilterNodeConstructor(
    createNativeIIRFilterNode,
    createIIRFilterNodeRenderer,
    isNativeOfflineAudioContext,
    noneAudioDestinationNodeConstructor
);
const createAudioListener = createAudioListenerFactory(
    createAudioParam,
    createNativeChannelMergerNode,
    createNativeConstantSourceNode,
    createNativeScriptProcessorNode,
    isNativeOfflineAudioContext
);
const minimalBaseAudioContextConstructor = createMinimalBaseAudioContextConstructor(audioDestinationNodeConstructor, createAudioListener);
const createNativeOscillatorNode = createNativeOscillatorNodeFactory(
    createNativeAudioNode,
    testAudioScheduledSourceNodeStartMethodNegativeParametersSupport,
    testAudioScheduledSourceNodeStopMethodConsecutiveCallsSupport,
    testAudioScheduledSourceNodeStopMethodNegativeParametersSupport,
    wrapAudioScheduledSourceNodeStopMethodConsecutiveCalls
);
const createOscillatorNodeRenderer = createOscillatorNodeRendererFactory(createNativeOscillatorNode);
const oscillatorNodeConstructor: TOscillatorNodeConstructor = createOscillatorNodeConstructor(
    createAudioParam,
    createInvalidStateError,
    createNativeOscillatorNode,
    createOscillatorNodeRenderer,
    isNativeOfflineAudioContext,
    noneAudioDestinationNodeConstructor
);
const createNativeWaveShaperNodeFaker = createNativeWaveShaperNodeFakerFactory(
    createInvalidStateError,
    createNativeAudioNode,
    createNativeGainNode
);
const createNativeWaveShaperNode = createNativeWaveShaperNodeFactory(
    createInvalidStateError,
    createNativeAudioNode,
    createNativeWaveShaperNodeFaker
);
const createNativePannerNodeFaker = createNativePannerNodeFakerFactory(
    createNativeAudioNode,
    createNativeChannelMergerNode,
    createNativeGainNode,
    createNativeScriptProcessorNode,
    createNativeWaveShaperNode,
    createNotSupportedError
);
const createNativePannerNode = createNativePannerNodeFactory(
    createInvalidStateError,
    createNativeAudioNode,
    createNativePannerNodeFaker
);
const createPannerNodeRenderer = createPannerNodeRendererFactory(createNativePannerNode);
const pannerNodeConstructor: TPannerNodeConstructor = createPannerNodeConstructor(
    createAudioParam,
    createInvalidStateError,
    createNativePannerNode,
    createPannerNodeRenderer,
    isNativeOfflineAudioContext,
    noneAudioDestinationNodeConstructor
);
const createNativePeriodicWave = createNativePeriodicWaveFactory(getBackupNativeContext);
const periodicWaveConstructor: TPeriodicWaveConstructor = createPeriodicWaveConstructor(createNativePeriodicWave);
const nativeStereoPannerNodeFakerFactory = createNativeStereoPannerNodeFakerFactory(
    createNativeChannelMergerNode,
    createNativeChannelSplitterNode,
    createNativeGainNode,
    createNativeWaveShaperNode,
    createNotSupportedError
);
const createNativeStereoPannerNode = createNativeStereoPannerNodeFactory(
    createNativeAudioNode,
    nativeStereoPannerNodeFakerFactory,
    createNotSupportedError
);
const createStereoPannerNodeRenderer = createStereoPannerNodeRendererFactory(createNativeStereoPannerNode);
const stereoPannerNodeConstructor: TStereoPannerNodeConstructor = createStereoPannerNodeConstructor(
    createAudioParam,
    createNativeStereoPannerNode,
    createStereoPannerNodeRenderer,
    isNativeOfflineAudioContext,
    noneAudioDestinationNodeConstructor
);
const createWaveShaperNodeRenderer = createWaveShaperNodeRendererFactory(createNativeWaveShaperNode);
const waveShaperNodeConstructor: TWaveShaperNodeConstructor = createWaveShaperNodeConstructor(
    createInvalidStateError,
    createNativeWaveShaperNode,
    createWaveShaperNodeRenderer,
    isNativeOfflineAudioContext,
    noneAudioDestinationNodeConstructor
);
const isSecureContext = createIsSecureContext(window);

// The addAudioWorkletModule() function is only available in a SecureContext.
export const addAudioWorkletModule: undefined | TAddAudioWorkletModuleFunction = (isSecureContext) ?
    createAddAudioWorkletModule(
        createAbortError,
        createNotSupportedError,
        createFetchSource(createAbortError),
        getBackupNativeContext
    ) :
    undefined;

const isNativeContext = createIsNativeContext(isNativeOfflineAudioContext, nativeAudioContextConstructor);

export const decodeAudioData: TDecodeAudioDataFunction = createDecodeAudioData(
    createDataCloneError,
    createEncodingError,
    nativeOfflineAudioContextConstructor,
    isNativeContext,
    isNativeOfflineAudioContext,
    testAudioBufferCopyChannelMethodsSubarraySupport,
    testPromiseSupport
);

const baseAudioContextConstructor = createBaseAudioContextConstructor(
    addAudioWorkletModule,
    analyserNodeConstructor,
    audioBufferConstructor,
    audioBufferSourceNodeConstructor,
    biquadFilterNodeConstructor,
    channelMergerNodeConstructor,
    channelSplitterNodeConstructor,
    constantSourceNodeConstructor,
    convolverNodeConstructor,
    decodeAudioData,
    delayNodeConstructor,
    dynamicsCompressorNodeConstructor,
    gainNodeConstructor,
    iIRFilterNodeConstructor,
    minimalBaseAudioContextConstructor,
    oscillatorNodeConstructor,
    pannerNodeConstructor,
    periodicWaveConstructor,
    stereoPannerNodeConstructor,
    waveShaperNodeConstructor
);
const createNativeMediaElementAudioSourceNode = createNativeMediaElementAudioSourceNodeFactory(createNativeAudioNode);
const mediaElementAudioSourceNodeConstructor: TMediaElementAudioSourceNodeConstructor = createMediaElementAudioSourceNodeConstructor(
    createNativeMediaElementAudioSourceNode,
    createNotSupportedError,
    isNativeOfflineAudioContext,
    noneAudioDestinationNodeConstructor
);
const createNativeMediaStreamAudioSourceNode = createNativeMediaStreamAudioSourceNodeFactory(
    createInvalidStateError,
    createNativeAudioNode
);
const mediaStreamAudioSourceNodeConstructor: TMediaStreamAudioSourceNodeConstructor = createMediaStreamAudioSourceNodeConstructor(
    createNativeMediaStreamAudioSourceNode,
    createNotSupportedError,
    isNativeOfflineAudioContext,
    noneAudioDestinationNodeConstructor
);
const audioContextConstructor: TAudioContextConstructor = createAudioContextConstructor(
    baseAudioContextConstructor,
    createInvalidStateError,
    createUnknownError,
    mediaElementAudioSourceNodeConstructor,
    mediaStreamAudioSourceNodeConstructor,
    nativeAudioContextConstructor
);

type audioContextConstructor = IAudioContext;

export { audioContextConstructor as AudioContext };

const connectMultipleOutputs = createConnectMultipleOutputs(createIndexSizeError);
const disconnectMultipleOutputs = createDisconnectMultipleOutputs(createIndexSizeError);
const createNativeAudioWorkletNodeFaker = createNativeAudioWorkletNodeFakerFactory(
    connectMultipleOutputs,
    createIndexSizeError,
    createInvalidStateError,
    createNativeChannelMergerNode,
    createNativeChannelSplitterNode,
    createNativeConstantSourceNode,
    createNativeGainNode,
    createNativeScriptProcessorNode,
    createNotSupportedError,
    disconnectMultipleOutputs
);
const createNativeAudioWorkletNode = createNativeAudioWorkletNodeFactory(
    createInvalidStateError,
    createNativeAudioNode,
    createNativeAudioWorkletNodeFaker,
    createNotSupportedError
);
const nativeAudioWorkletNodeConstructor = createNativeAudioWorkletNodeConstructor(window);
const createAudioWorkletNodeRenderer = createAudioWorkletNodeRendererFactory(
    connectMultipleOutputs,
    createNativeAudioBufferSourceNode,
    createNativeChannelMergerNode,
    createNativeChannelSplitterNode,
    createNativeConstantSourceNode,
    createNativeGainNode,
    disconnectMultipleOutputs,
    nativeAudioWorkletNodeConstructor,
    nativeOfflineAudioContextConstructor,
    renderNativeOfflineAudioContext
);

// The AudioWorkletNode constructor is only available in a SecureContext.
const audioWorkletNodeConstructor: undefined | TAudioWorkletNodeConstructor = (isSecureContext) ?
    createAudioWorkletNodeConstructor(
        createAudioParam,
        createAudioWorkletNodeRenderer,
        createNativeAudioWorkletNode,
        gainNodeConstructor,
        isNativeOfflineAudioContext,
        nativeAudioWorkletNodeConstructor,
        noneAudioDestinationNodeConstructor
    ) :
    undefined;

type audioWorkletNodeConstructor = undefined | IAudioWorkletNode;

export { audioWorkletNodeConstructor as AudioWorkletNode };

type biquadFilterNodeConstructor = IBiquadFilterNode;

export { biquadFilterNodeConstructor as BiquadFilterNode };

type channelMergerNodeConstructor = IAudioNode;

export { channelMergerNodeConstructor as ChannelMergerNode };

type channelSplitterNodeConstructor = IAudioNode;

export { channelSplitterNodeConstructor as ChannelSplitterNode };

type constantSourceNodeConstructor = IConstantSourceNode;

export { convolverNodeConstructor as ConvolverNode };

type convolverNodeConstructor = IConvolverNode;

export { constantSourceNodeConstructor as ConstantSourceNode };

type delayNodeConstructor = IDelayNode;

export { delayNodeConstructor as DelayNode };

type dynamicsCompressorNodeConstructor = IDynamicsCompressorNode;

export { dynamicsCompressorNodeConstructor as DynamicsCompressorNode };

type gainNodeConstructor = IGainNode;

export { gainNodeConstructor as GainNode };

type iIRFilterNodeConstructor = IIIRFilterNode;

export { iIRFilterNodeConstructor as IIRFilterNode };

type mediaElementAudioSourceNodeConstructor = IMediaElementAudioSourceNode;

export { mediaElementAudioSourceNodeConstructor as MediaElementAudioSourceNode };

type mediaStreamAudioSourceNodeConstructor = IMediaStreamAudioSourceNode;

export { mediaStreamAudioSourceNodeConstructor as MediaStreamAudioSourceNode };

const minimalAudioContextConstructor: TMinimalAudioContextConstructor = createMinimalAudioContextConstructor(
    createInvalidStateError,
    createUnknownError,
    minimalBaseAudioContextConstructor,
    nativeAudioContextConstructor
);

type minimalAudioContextConstructor = IMinimalAudioContext;

export { minimalAudioContextConstructor as MinimalAudioContext };

const startRendering = createStartRendering(renderNativeOfflineAudioContext, testAudioBufferCopyChannelMethodsSubarraySupport);
const minimalOfflineAudioContextConstructor: TMinimalOfflineAudioContextConstructor = createMinimalOfflineAudioContextConstructor(
    createInvalidStateError,
    minimalBaseAudioContextConstructor,
    nativeOfflineAudioContextConstructor,
    startRendering
);

type minimalOfflineAudioContextConstructor = IMinimalOfflineAudioContext;

export { minimalOfflineAudioContextConstructor as MinimalOfflineAudioContext };

const offlineAudioContextConstructor: IOfflineAudioContextConstructor = createOfflineAudioContextConstructor(
    baseAudioContextConstructor,
    createInvalidStateError,
    nativeOfflineAudioContextConstructor,
    startRendering
);

type offlineAudioContextConstructor = IOfflineAudioContext;

export { offlineAudioContextConstructor as OfflineAudioContext };

type oscillatorNodeConstructor = IOscillatorNode;

export { oscillatorNodeConstructor as OscillatorNode };

type pannerNodeConstructor = IPannerNode;

export { pannerNodeConstructor as PannerNode };

type periodicWaveConstructor = IPeriodicWave;

export { periodicWaveConstructor as PeriodicWave };

type stereoPannerNodeConstructor = IStereoPannerNode;

export { stereoPannerNodeConstructor as StereoPannerNode };

type waveShaperNodeConstructor = IWaveShaperNode;

export { waveShaperNodeConstructor as WaveShaperNode };

export const isSupported = () => createIsSupportedPromise(
    browsernizr,
    createTestAudioContextCloseMethodSupport(nativeAudioContextConstructor),
    createTestAudioContextDecodeAudioDataMethodTypeErrorSupport(nativeOfflineAudioContextConstructor),
    createTestAudioContextOptionsSupport(nativeAudioContextConstructor),
    createTestChannelMergerNodeSupport(nativeAudioContextConstructor),
    createTestChannelSplitterNodeChannelCountSupport(nativeOfflineAudioContextConstructor),
    createTestConstantSourceNodeAccurateSchedulingSupport(createNativeAudioNode, nativeOfflineAudioContextConstructor),
    createTestIsSecureContextSupport(window),
    createTestStereoPannerNodeDefaultValueSupport(nativeOfflineAudioContextConstructor),
    testTransferablesSupport
);
