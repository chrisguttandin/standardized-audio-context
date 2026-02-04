import {
    createCancelAndHoldAutomationEvent,
    createCancelScheduledValuesAutomationEvent,
    createExponentialRampToValueAutomationEvent,
    createLinearRampToValueAutomationEvent,
    createSetTargetAutomationEvent,
    createSetValueAutomationEvent,
    createSetValueCurveAutomationEvent
} from 'automation-events';
import { createAbortError } from './factories/abort-error';
import { createAddActiveInputConnectionToAudioNode } from './factories/add-active-input-connection-to-audio-node';
import { createAddAudioNodeConnections } from './factories/add-audio-node-connections';
import { createAddAudioParamConnections } from './factories/add-audio-param-connections';
import { createAddAudioWorkletModule } from './factories/add-audio-worklet-module';
import { createAddConnectionToAudioNode } from './factories/add-connection-to-audio-node';
import { createAddPassiveInputConnectionToAudioNode } from './factories/add-passive-input-connection-to-audio-node';
import { createAddSilentConnection } from './factories/add-silent-connection';
import { createAddUnrenderedAudioWorkletNode } from './factories/add-unrendered-audio-worklet-node';
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
import { createAudioWorkletNodeConstructor } from './factories/audio-worklet-node-constructor';
import { createAudioWorkletNodeRendererFactory } from './factories/audio-worklet-node-renderer-factory';
import { createBaseAudioContextConstructor } from './factories/base-audio-context-constructor';
import { createBiquadFilterNodeConstructor } from './factories/biquad-filter-node-constructor';
import { createBiquadFilterNodeRendererFactory } from './factories/biquad-filter-node-renderer-factory';
import { createCacheTestResult } from './factories/cache-test-result';
import { createChannelMergerNodeConstructor } from './factories/channel-merger-node-constructor';
import { createChannelMergerNodeRendererFactory } from './factories/channel-merger-node-renderer-factory';
import { createChannelSplitterNodeConstructor } from './factories/channel-splitter-node-constructor';
import { createChannelSplitterNodeRendererFactory } from './factories/channel-splitter-node-renderer-factory';
import { createConnectAudioParam } from './factories/connect-audio-param';
import { createConnectedNativeAudioBufferSourceNodeFactory } from './factories/connected-native-audio-buffer-source-node-factory';
import { createConstantSourceNodeConstructor } from './factories/constant-source-node-constructor';
import { createConstantSourceNodeRendererFactory } from './factories/constant-source-node-renderer-factory';
import { createConvolverNodeConstructor } from './factories/convolver-node-constructor';
import { createConvolverNodeRendererFactory } from './factories/convolver-node-renderer-factory';
import { createCreateNativeOfflineAudioContext } from './factories/create-native-offline-audio-context';
import { createDataCloneError } from './factories/data-clone-error';
import { createDecodeAudioData } from './factories/decode-audio-data';
import { createDecrementCycleCounter } from './factories/decrement-cycle-counter';
import { createDelayNodeConstructor } from './factories/delay-node-constructor';
import { createDelayNodeRendererFactory } from './factories/delay-node-renderer-factory';
import { createDeleteActiveInputConnectionToAudioNode } from './factories/delete-active-input-connection-to-audio-node';
import { createDeleteUnrenderedAudioWorkletNode } from './factories/delete-unrendered-audio-worklet-node';
import { createDetectCycles } from './factories/detect-cycles';
import { createDynamicsCompressorNodeConstructor } from './factories/dynamics-compressor-node-constructor';
import { createDynamicsCompressorNodeRendererFactory } from './factories/dynamics-compressor-node-renderer-factory';
import { createEventTargetConstructor } from './factories/event-target-constructor';
import { createFetchSource } from './factories/fetch-source';
import { createGainNodeConstructor } from './factories/gain-node-constructor';
import { createGainNodeRendererFactory } from './factories/gain-node-renderer-factory';
import { createGetAudioNodeRenderer } from './factories/get-audio-node-renderer';
import { createGetAudioNodeTailTime } from './factories/get-audio-node-tail-time';
import { createGetBackupOfflineAudioContext } from './factories/get-backup-offline-audio-context';
import { createGetNativeContext } from './factories/get-native-context';
import { createGetOrCreateBackupOfflineAudioContext } from './factories/get-or-create-backup-offline-audio-context';
import { createGetUnrenderedAudioWorkletNodes } from './factories/get-unrendered-audio-worklet-nodes';
import { createIIRFilterNodeConstructor } from './factories/iir-filter-node-constructor';
import { createIIRFilterNodeRendererFactory } from './factories/iir-filter-node-renderer-factory';
import { createIncrementCycleCounterFactory } from './factories/increment-cycle-counter-factory';
import { createIndexSizeError } from './factories/index-size-error';
import { createInvalidAccessError } from './factories/invalid-access-error';
import { createInvalidStateError } from './factories/invalid-state-error';
import { createIsAnyAudioContext } from './factories/is-any-audio-context';
import { createIsAnyAudioNode } from './factories/is-any-audio-node';
import { createIsAnyAudioParam } from './factories/is-any-audio-param';
import { createIsAnyOfflineAudioContext } from './factories/is-any-offline-audio-context';
import { createIsNativeAudioContext } from './factories/is-native-audio-context';
import { createIsNativeAudioNode } from './factories/is-native-audio-node';
import { createIsNativeAudioParam } from './factories/is-native-audio-param';
import { createIsNativeContext } from './factories/is-native-context';
import { createIsNativeOfflineAudioContext } from './factories/is-native-offline-audio-context';
import { createIsSecureContext } from './factories/is-secure-context';
import { createIsSupportedPromise } from './factories/is-supported-promise';
import { createMediaElementAudioSourceNodeConstructor } from './factories/media-element-audio-source-node-constructor';
import { createMediaStreamAudioDestinationNodeConstructor } from './factories/media-stream-audio-destination-node-constructor';
import { createMediaStreamAudioSourceNodeConstructor } from './factories/media-stream-audio-source-node-constructor';
import { createMediaStreamTrackAudioSourceNodeConstructor } from './factories/media-stream-track-audio-source-node-constructor';
import { createMinimalAudioContextConstructor } from './factories/minimal-audio-context-constructor';
import { createMinimalBaseAudioContextConstructor } from './factories/minimal-base-audio-context-constructor';
import { createMinimalOfflineAudioContextConstructor } from './factories/minimal-offline-audio-context-constructor';
import { createMonitorConnections } from './factories/monitor-connections';
import { createNativeAnalyserNodeFactory } from './factories/native-analyser-node-factory';
import { createNativeAudioBufferConstructor } from './factories/native-audio-buffer-constructor';
import { createNativeAudioBufferSourceNodeFactory } from './factories/native-audio-buffer-source-node-factory';
import { createNativeAudioContextConstructor } from './factories/native-audio-context-constructor';
import { createNativeAudioDestinationNodeFactory } from './factories/native-audio-destination-node';
import { createNativeAudioWorkletNodeConstructor } from './factories/native-audio-worklet-node-constructor';
import { createNativeAudioWorkletNodeFactory } from './factories/native-audio-worklet-node-factory';
import { createNativeBiquadFilterNode } from './factories/native-biquad-filter-node';
import { createNativeChannelMergerNode } from './factories/native-channel-merger-node';
import { createNativeChannelSplitterNode } from './factories/native-channel-splitter-node';
import { createNativeConstantSourceNodeFactory } from './factories/native-constant-source-node-factory';
import { createNativeConvolverNode } from './factories/native-convolver-node';
import { createNativeDelayNode } from './factories/native-delay-node';
import { createNativeDynamicsCompressorNode } from './factories/native-dynamics-compressor-node';
import { createNativeGainNode } from './factories/native-gain-node';
import { createNativeIIRFilterNode } from './factories/native-iir-filter-node';
import { createNativeMediaElementAudioSourceNode } from './factories/native-media-element-audio-source-node';
import { createNativeMediaStreamAudioDestinationNode } from './factories/native-media-stream-audio-destination-node';
import { createNativeMediaStreamAudioSourceNode } from './factories/native-media-stream-audio-source-node';
import { createNativeMediaStreamTrackAudioSourceNodeFactory } from './factories/native-media-stream-track-audio-source-node-factory';
import { createNativeOfflineAudioContextConstructor } from './factories/native-offline-audio-context-constructor';
import { createNativeOscillatorNodeFactory } from './factories/native-oscillator-node-factory';
import { createNativePannerNode } from './factories/native-panner-node';
import { createNativePeriodicWave } from './factories/native-periodic-wave';
import { createNativePeriodicWaveConstructor } from './factories/native-periodic-wave-constructor';
import { createNativeScriptProcessorNode } from './factories/native-script-processor-node';
import { createNativeStereoPannerNode } from './factories/native-stereo-panner-node';
import { createNativeWaveShaperNodeFactory } from './factories/native-wave-shaper-node-factory';
import { createNotSupportedError } from './factories/not-supported-error';
import { createOfflineAudioContextConstructor } from './factories/offline-audio-context-constructor';
import { createOscillatorNodeConstructor } from './factories/oscillator-node-constructor';
import { createOscillatorNodeRendererFactory } from './factories/oscillator-node-renderer-factory';
import { createPannerNodeConstructor } from './factories/panner-node-constructor';
import { createPannerNodeRendererFactory } from './factories/panner-node-renderer-factory';
import { createPeriodicWaveConstructor } from './factories/periodic-wave-constructor';
import { createRenderInputsOfAudioNode } from './factories/render-inputs-of-audio-node';
import { createRenderInputsOfAudioParam } from './factories/render-inputs-of-audio-param';
import { createSetActiveAudioWorkletNodeInputs } from './factories/set-active-audio-worklet-node-inputs';
import { createSetAudioNodeTailTime } from './factories/set-audio-node-tail-time';
import { createStartRendering } from './factories/start-rendering';
import { createStereoPannerNodeConstructor } from './factories/stereo-panner-node-constructor';
import { createStereoPannerNodeRendererFactory } from './factories/stereo-panner-node-renderer-factory';
import { createTestAudioBufferConstructorSupport } from './factories/test-audio-buffer-constructor-support';
import { createTestAudioBufferCopyChannelMethodsOutOfBoundsSupport } from './factories/test-audio-buffer-copy-channel-methods-out-of-bounds-support';
import { createTestAudioBufferCopyChannelMethodsSubarraySupport } from './factories/test-audio-buffer-copy-channel-methods-subarray-support';
import { createTestAudioBufferFactoryMethodSupport } from './factories/test-audio-buffer-factory-method-support';
import { createTestAudioBufferSourceNodeBufferReassignmentSupport } from './factories/test-audio-buffer-source-node-buffer-reassignment-support';
import { createTestAudioContextCloseMethodSupport } from './factories/test-audio-context-close-method-support';
import { createTestAudioContextDecodeAudioDataMethodTypeErrorSupport } from './factories/test-audio-context-decode-audio-data-method-type-error-support';
import { createTestAudioContextGetOutputTimestampSupport } from './factories/test-audio-context-get-output-timestamp-support';
import { createTestAudioContextOptionsSupport } from './factories/test-audio-context-options-support';
import { createTestAudioContextResumeSupport } from './factories/test-audio-context-resume-support';
import { createTestAudioNodeConnectMethodChainabilitySupport } from './factories/test-audio-node-connect-method-chainability-support';
import { createTestAudioNodeConnectMethodVerificationSupport } from './factories/test-audio-node-connect-method-verification-support';
import { createTestAudioParamValueSetterSupport } from './factories/test-audio-param-value-setter-support';
import { createTestAudioWorkletAddModuleMethodSupport } from './factories/test-audio-worklet-add-module-method-support';
import { createTestAudioWorkletNodeConstructorSupport } from './factories/test-audio-worklet-node-constructor-support';
import { createTestAudioWorkletProcessorNoInputsSupport } from './factories/test-audio-worklet-processor-no-inputs-support';
import { createTestAudioWorkletProcessorNoOutputsSupport } from './factories/test-audio-worklet-processor-no-outputs-support';
import { createTestAudioWorkletProcessorPostMessageSupport } from './factories/test-audio-worklet-processor-post-message-support';
import { createTestBiquadFilterNodeGetFrequencyResponseMethodSupport } from './factories/test-biquad-filter-node-get-frequency-response-method-support';
import { createTestChannelMergerNodeChannelCountSupport } from './factories/test-channel-merger-node-channel-count-support';
import { createTestConstantSourceNodeAccurateSchedulingSupport } from './factories/test-constant-source-node-accurate-scheduling-support';
import { createTestConvolverNodeBufferReassignabilitySupport } from './factories/test-convolver-node-buffer-reassignability-support';
import { createTestConvolverNodeChannelCountSupport } from './factories/test-convolver-node-channel-count-support';
import { createTestIsSecureContextSupport } from './factories/test-is-secure-context-support';
import { createTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport } from './factories/test-media-stream-audio-source-node-media-stream-without-audio-track-support';
import { createTestPeriodicWaveConstructorSupport } from './factories/test-periodic-wave-constructor-support';
import { createTestStereoPannerNodeDefaultValueSupport } from './factories/test-stereo-panner-node-default-value-support';
import { createWaveShaperNodeConstructor } from './factories/wave-shaper-node-constructor';
import { createWaveShaperNodeRendererFactory } from './factories/wave-shaper-node-renderer-factory';
import { createWindow } from './factories/window';
import {
    AUDIO_NODE_CONNECTIONS_STORE,
    AUDIO_NODE_STORE,
    AUDIO_PARAM_CONNECTIONS_STORE,
    AUDIO_PARAM_STORE,
    CONTEXT_STORE,
    CYCLE_COUNTERS
} from './globals';
import { connectNativeAudioNodeToNativeAudioNode } from './helpers/connect-native-audio-node-to-native-audio-node';
import { disconnectNativeAudioNodeFromNativeAudioNode } from './helpers/disconnect-native-audio-node-from-native-audio-node';
import { getAudioNodeConnections } from './helpers/get-audio-node-connections';
import { getAudioParamConnections } from './helpers/get-audio-param-connections';
import { getEventListenersOfAudioNode } from './helpers/get-event-listeners-of-audio-node';
import { getFirstSample } from './helpers/get-first-sample';
import { getNativeAudioNode } from './helpers/get-native-audio-node';
import { getNativeAudioParam } from './helpers/get-native-audio-param';
import { getValueForKey } from './helpers/get-value-for-key';
import { insertElementInSet } from './helpers/insert-element-in-set';
import { isActiveAudioNode } from './helpers/is-active-audio-node';
import { isDCCurve } from './helpers/is-dc-curve';
import { isPartOfACycle } from './helpers/is-part-of-a-cycle';
import { isPassiveAudioNode } from './helpers/is-passive-audio-node';
import { overwriteAccessors } from './helpers/overwrite-accessors';
import { pickElementFromSet } from './helpers/pick-element-from-set';
import { sanitizeChannelSplitterOptions } from './helpers/sanitize-channel-splitter-options';
import { sanitizePeriodicWaveOptions } from './helpers/sanitize-periodic-wave-options';
import { testAudioScheduledSourceNodeStopMethodNegativeParametersSupport } from './helpers/test-audio-scheduled-source-node-stop-method-negative-parameters-support';
import { testAudioWorkletNodeOptionsClonability } from './helpers/test-audio-worklet-node-options-clonability';
import { testDomExceptionConstructorSupport } from './helpers/test-dom-exception-constructor-support';
import { testErrorEventErrorPropertySupport } from './helpers/test-error-event-error-property-support';
import { testTransferablesSupport } from './helpers/test-transferables-support';
import { wrapEventListener } from './helpers/wrap-event-listener';
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
    IMediaStreamAudioDestinationNode,
    IMediaStreamAudioSourceNode,
    IMediaStreamTrackAudioSourceNode,
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
import {
    TActiveAudioWorkletNodeInputsStore,
    TAnalyserNodeConstructor,
    TAudioBufferConstructor,
    TAudioBufferSourceNodeConstructor,
    TAudioBufferStore,
    TAudioContextConstructor,
    TAudioParamAudioNodeStore,
    TAudioWorkletNodeConstructor,
    TBackupOfflineAudioContextStore,
    TBiquadFilterNodeConstructor,
    TChannelMergerNodeConstructor,
    TChannelSplitterNodeConstructor,
    TConstantSourceNodeConstructor,
    TContext,
    TConvolverNodeConstructor,
    TDelayNodeConstructor,
    TDynamicsCompressorNodeConstructor,
    TGainNodeConstructor,
    TIIRFilterNodeConstructor,
    TMediaElementAudioSourceNodeConstructor,
    TMediaStreamAudioDestinationNodeConstructor,
    TMediaStreamAudioSourceNodeConstructor,
    TMediaStreamTrackAudioSourceNodeConstructor,
    TMinimalAudioContextConstructor,
    TMinimalOfflineAudioContextConstructor,
    TOscillatorNodeConstructor,
    TPannerNodeConstructor,
    TPeriodicWaveConstructor,
    TStereoPannerNodeConstructor,
    TUnrenderedAudioWorkletNodeStore,
    TWaveShaperNodeConstructor
} from './types';

/*
 * @todo Explicitly referencing the barrel file seems to be necessary when enabling the
 * isolatedModules compiler option.
 */
export * from './interfaces/index';
export * from './types/index';

const addActiveInputConnectionToAudioNode = createAddActiveInputConnectionToAudioNode(insertElementInSet);
const addPassiveInputConnectionToAudioNode = createAddPassiveInputConnectionToAudioNode(insertElementInSet);
const deleteActiveInputConnectionToAudioNode = createDeleteActiveInputConnectionToAudioNode(pickElementFromSet);
const audioNodeTailTimeStore = new WeakMap();
const getAudioNodeTailTime = createGetAudioNodeTailTime(audioNodeTailTimeStore);
const cacheTestResult = createCacheTestResult(new Map(), new WeakMap());
const window = createWindow();
const createNativeAnalyserNode = createNativeAnalyserNodeFactory(createIndexSizeError);
const getAudioNodeRenderer = createGetAudioNodeRenderer(getAudioNodeConnections);
const renderInputsOfAudioNode = createRenderInputsOfAudioNode(getAudioNodeConnections, getAudioNodeRenderer, isPartOfACycle);
const createAnalyserNodeRenderer = createAnalyserNodeRendererFactory(getNativeAudioNode, renderInputsOfAudioNode);
const getNativeContext = createGetNativeContext(CONTEXT_STORE);
const nativeOfflineAudioContextConstructor = createNativeOfflineAudioContextConstructor(window);
const isNativeOfflineAudioContext = createIsNativeOfflineAudioContext(nativeOfflineAudioContextConstructor);
const audioParamAudioNodeStore: TAudioParamAudioNodeStore = new WeakMap();
const eventTargetConstructor = createEventTargetConstructor(wrapEventListener);
const nativeAudioContextConstructor = createNativeAudioContextConstructor(window);
const isNativeAudioContext = createIsNativeAudioContext(nativeAudioContextConstructor);
const isNativeAudioNode = createIsNativeAudioNode(window);
const isNativeAudioParam = createIsNativeAudioParam(window);
const nativeAudioWorkletNodeConstructor = createNativeAudioWorkletNodeConstructor(window);
const audioNodeConstructor = createAudioNodeConstructor(
    createAddAudioNodeConnections(AUDIO_NODE_CONNECTIONS_STORE),
    createAddConnectionToAudioNode(
        addActiveInputConnectionToAudioNode,
        addPassiveInputConnectionToAudioNode,
        connectNativeAudioNodeToNativeAudioNode,
        deleteActiveInputConnectionToAudioNode,
        disconnectNativeAudioNodeFromNativeAudioNode,
        getAudioNodeConnections,
        getAudioNodeTailTime,
        getEventListenersOfAudioNode,
        getNativeAudioNode,
        insertElementInSet,
        isActiveAudioNode,
        isPartOfACycle,
        isPassiveAudioNode
    ),
    createIncrementCycleCounterFactory(
        CYCLE_COUNTERS,
        disconnectNativeAudioNodeFromNativeAudioNode,
        getAudioNodeConnections,
        getNativeAudioNode,
        getNativeAudioParam,
        isActiveAudioNode
    ),
    createIndexSizeError,
    createInvalidAccessError,
    createDecrementCycleCounter(
        connectNativeAudioNodeToNativeAudioNode,
        CYCLE_COUNTERS,
        getAudioNodeConnections,
        getNativeAudioNode,
        getNativeAudioParam,
        getNativeContext,
        isActiveAudioNode,
        isNativeOfflineAudioContext
    ),
    createDetectCycles(audioParamAudioNodeStore, getAudioNodeConnections, getValueForKey),
    eventTargetConstructor,
    getNativeContext,
    isNativeAudioNode,
    isNativeAudioParam,
    isNativeOfflineAudioContext
);
const analyserNodeConstructor: TAnalyserNodeConstructor = createAnalyserNodeConstructor(
    audioNodeConstructor,
    createAnalyserNodeRenderer,
    createNativeAnalyserNode,
    getNativeContext,
    isNativeOfflineAudioContext
);

type analyserNodeConstructor<T extends TContext> = IAnalyserNode<T>;

export { analyserNodeConstructor as AnalyserNode };

const audioBufferStore: TAudioBufferStore = new WeakSet();
const nativeAudioBufferConstructor = createNativeAudioBufferConstructor(window);
const audioBufferConstructor: TAudioBufferConstructor = createAudioBufferConstructor(audioBufferStore, nativeAudioBufferConstructor);

type audioBufferConstructor = IAudioBuffer;

export { audioBufferConstructor as AudioBuffer };

const addSilentConnection = createAddSilentConnection(createNativeGainNode);
const renderInputsOfAudioParam = createRenderInputsOfAudioParam(getAudioNodeRenderer, getAudioParamConnections, isPartOfACycle);
const connectAudioParam = createConnectAudioParam(renderInputsOfAudioParam);
const createNativeAudioBufferSourceNode = createNativeAudioBufferSourceNodeFactory(
    addSilentConnection,
    cacheTestResult,
    testAudioScheduledSourceNodeStopMethodNegativeParametersSupport
);
const createAudioBufferSourceNodeRenderer = createAudioBufferSourceNodeRendererFactory(
    connectAudioParam,
    getNativeAudioNode,
    renderInputsOfAudioNode
);
const createAudioParam = createAudioParamFactory(
    createAddAudioParamConnections(AUDIO_PARAM_CONNECTIONS_STORE),
    audioParamAudioNodeStore,
    AUDIO_PARAM_STORE,
    createCancelAndHoldAutomationEvent,
    createCancelScheduledValuesAutomationEvent,
    createExponentialRampToValueAutomationEvent,
    createLinearRampToValueAutomationEvent,
    createSetTargetAutomationEvent,
    createSetValueAutomationEvent,
    createSetValueCurveAutomationEvent
);
const audioBufferSourceNodeConstructor: TAudioBufferSourceNodeConstructor = createAudioBufferSourceNodeConstructor(
    audioNodeConstructor,
    createAudioBufferSourceNodeRenderer,
    createAudioParam,
    createNativeAudioBufferSourceNode,
    getNativeContext,
    isNativeOfflineAudioContext,
    wrapEventListener
);

type audioBufferSourceNodeConstructor<T extends TContext> = IAudioBufferSourceNode<T>;

export { audioBufferSourceNodeConstructor as AudioBufferSourceNode };

const audioDestinationNodeConstructor = createAudioDestinationNodeConstructor(
    audioNodeConstructor,
    createAudioDestinationNodeRenderer,
    createInvalidStateError,
    createNativeAudioDestinationNodeFactory(createNativeGainNode, overwriteAccessors),
    getNativeContext,
    isNativeOfflineAudioContext,
    renderInputsOfAudioNode
);
const createBiquadFilterNodeRenderer = createBiquadFilterNodeRendererFactory(
    connectAudioParam,
    getNativeAudioNode,
    renderInputsOfAudioNode
);
const setAudioNodeTailTime = createSetAudioNodeTailTime(audioNodeTailTimeStore);
const biquadFilterNodeConstructor: TBiquadFilterNodeConstructor = createBiquadFilterNodeConstructor(
    audioNodeConstructor,
    createAudioParam,
    createBiquadFilterNodeRenderer,
    createNativeBiquadFilterNode,
    getNativeContext,
    isNativeOfflineAudioContext,
    setAudioNodeTailTime
);
const monitorConnections = createMonitorConnections(insertElementInSet, isNativeAudioNode);
const createChannelMergerNodeRenderer = createChannelMergerNodeRendererFactory(getNativeAudioNode, renderInputsOfAudioNode);
const channelMergerNodeConstructor: TChannelMergerNodeConstructor = createChannelMergerNodeConstructor(
    audioNodeConstructor,
    createChannelMergerNodeRenderer,
    createNativeChannelMergerNode,
    getNativeContext,
    isNativeOfflineAudioContext
);
const createChannelSplitterNodeRenderer = createChannelSplitterNodeRendererFactory(getNativeAudioNode, renderInputsOfAudioNode);
const channelSplitterNodeConstructor: TChannelSplitterNodeConstructor = createChannelSplitterNodeConstructor(
    audioNodeConstructor,
    createChannelSplitterNodeRenderer,
    createNativeChannelSplitterNode,
    getNativeContext,
    isNativeOfflineAudioContext,
    sanitizeChannelSplitterOptions
);
const createNativeConstantSourceNode = createNativeConstantSourceNodeFactory(
    addSilentConnection,
    cacheTestResult,
    testAudioScheduledSourceNodeStopMethodNegativeParametersSupport
);
const createConstantSourceNodeRenderer = createConstantSourceNodeRendererFactory(
    connectAudioParam,
    getNativeAudioNode,
    renderInputsOfAudioNode
);
const constantSourceNodeConstructor: TConstantSourceNodeConstructor = createConstantSourceNodeConstructor(
    audioNodeConstructor,
    createAudioParam,
    createConstantSourceNodeRenderer,
    createNativeConstantSourceNode,
    getNativeContext,
    isNativeOfflineAudioContext,
    wrapEventListener
);
const createConvolverNodeRenderer = createConvolverNodeRendererFactory(getNativeAudioNode, renderInputsOfAudioNode);
const convolverNodeConstructor: TConvolverNodeConstructor = createConvolverNodeConstructor(
    audioNodeConstructor,
    createConvolverNodeRenderer,
    createNativeConvolverNode,
    getNativeContext,
    isNativeOfflineAudioContext,
    setAudioNodeTailTime
);
const createDelayNodeRenderer = createDelayNodeRendererFactory(connectAudioParam, getNativeAudioNode, renderInputsOfAudioNode);
const delayNodeConstructor: TDelayNodeConstructor = createDelayNodeConstructor(
    audioNodeConstructor,
    createAudioParam,
    createDelayNodeRenderer,
    createNativeDelayNode,
    getNativeContext,
    isNativeOfflineAudioContext,
    setAudioNodeTailTime
);
const createDynamicsCompressorNodeRenderer = createDynamicsCompressorNodeRendererFactory(
    connectAudioParam,
    getNativeAudioNode,
    renderInputsOfAudioNode
);
const dynamicsCompressorNodeConstructor: TDynamicsCompressorNodeConstructor = createDynamicsCompressorNodeConstructor(
    audioNodeConstructor,
    createAudioParam,
    createDynamicsCompressorNodeRenderer,
    createNativeDynamicsCompressorNode,
    getNativeContext,
    isNativeOfflineAudioContext,
    setAudioNodeTailTime
);
const createGainNodeRenderer = createGainNodeRendererFactory(connectAudioParam, getNativeAudioNode, renderInputsOfAudioNode);
const gainNodeConstructor: TGainNodeConstructor = createGainNodeConstructor(
    audioNodeConstructor,
    createAudioParam,
    createGainNodeRenderer,
    createNativeGainNode,
    getNativeContext,
    isNativeOfflineAudioContext
);
const createIIRFilterNodeRenderer = createIIRFilterNodeRendererFactory(getNativeAudioNode, renderInputsOfAudioNode);
const iIRFilterNodeConstructor: TIIRFilterNodeConstructor = createIIRFilterNodeConstructor(
    audioNodeConstructor,
    createNativeIIRFilterNode,
    createIIRFilterNodeRenderer,
    getNativeContext,
    isNativeOfflineAudioContext,
    setAudioNodeTailTime
);
const createAudioListener = createAudioListenerFactory(
    createAudioParam,
    createNativeChannelMergerNode,
    createNativeConstantSourceNode,
    createNativeScriptProcessorNode,
    createNotSupportedError,
    getFirstSample,
    isNativeOfflineAudioContext,
    overwriteAccessors
);
const unrenderedAudioWorkletNodeStore: TUnrenderedAudioWorkletNodeStore = new WeakMap();
const minimalBaseAudioContextConstructor = createMinimalBaseAudioContextConstructor(
    audioDestinationNodeConstructor,
    createAudioListener,
    eventTargetConstructor,
    isNativeOfflineAudioContext,
    unrenderedAudioWorkletNodeStore,
    wrapEventListener
);
const createNativeOscillatorNode = createNativeOscillatorNodeFactory(
    addSilentConnection,
    cacheTestResult,
    testAudioScheduledSourceNodeStopMethodNegativeParametersSupport
);
const createOscillatorNodeRenderer = createOscillatorNodeRendererFactory(connectAudioParam, getNativeAudioNode, renderInputsOfAudioNode);
const oscillatorNodeConstructor: TOscillatorNodeConstructor = createOscillatorNodeConstructor(
    audioNodeConstructor,
    createAudioParam,
    createNativeOscillatorNode,
    createOscillatorNodeRenderer,
    getNativeContext,
    isNativeOfflineAudioContext,
    wrapEventListener
);
const createConnectedNativeAudioBufferSourceNode = createConnectedNativeAudioBufferSourceNodeFactory(createNativeAudioBufferSourceNode);
const createNativeWaveShaperNode = createNativeWaveShaperNodeFactory(
    createConnectedNativeAudioBufferSourceNode,
    createInvalidStateError,
    isDCCurve,
    monitorConnections,
    overwriteAccessors
);
const createPannerNodeRenderer = createPannerNodeRendererFactory(connectAudioParam, getNativeAudioNode, renderInputsOfAudioNode);
const pannerNodeConstructor: TPannerNodeConstructor = createPannerNodeConstructor(
    audioNodeConstructor,
    createAudioParam,
    createNativePannerNode,
    createPannerNodeRenderer,
    getNativeContext,
    isNativeOfflineAudioContext,
    setAudioNodeTailTime
);
const periodicWaveConstructor: TPeriodicWaveConstructor = createPeriodicWaveConstructor(
    createNativePeriodicWave,
    getNativeContext,
    new WeakSet(),
    sanitizePeriodicWaveOptions
);
const createStereoPannerNodeRenderer = createStereoPannerNodeRendererFactory(
    connectAudioParam,
    getNativeAudioNode,
    renderInputsOfAudioNode
);
const stereoPannerNodeConstructor: TStereoPannerNodeConstructor = createStereoPannerNodeConstructor(
    audioNodeConstructor,
    createAudioParam,
    createNativeStereoPannerNode,
    createStereoPannerNodeRenderer,
    getNativeContext,
    isNativeOfflineAudioContext
);
const createWaveShaperNodeRenderer = createWaveShaperNodeRendererFactory(getNativeAudioNode, renderInputsOfAudioNode);
const waveShaperNodeConstructor: TWaveShaperNodeConstructor = createWaveShaperNodeConstructor(
    audioNodeConstructor,
    createInvalidStateError,
    createNativeWaveShaperNode,
    createWaveShaperNodeRenderer,
    getNativeContext,
    isNativeOfflineAudioContext,
    setAudioNodeTailTime
);
const isSecureContext = createIsSecureContext(window);
const backupOfflineAudioContextStore: TBackupOfflineAudioContextStore = new WeakMap();
const getOrCreateBackupOfflineAudioContext = createGetOrCreateBackupOfflineAudioContext(
    backupOfflineAudioContextStore,
    nativeOfflineAudioContextConstructor
);
const addAudioWorkletModule = isSecureContext
    ? createAddAudioWorkletModule(
          cacheTestResult,
          createFetchSource(createAbortError),
          getNativeContext,
          getOrCreateBackupOfflineAudioContext,
          isNativeOfflineAudioContext,
          new WeakMap(),
          new WeakMap(),
          createTestAudioWorkletProcessorPostMessageSupport(nativeAudioWorkletNodeConstructor, nativeOfflineAudioContextConstructor)
      )
    : undefined;
const isNativeContext = createIsNativeContext(isNativeAudioContext, isNativeOfflineAudioContext);
const decodeAudioData = createDecodeAudioData(audioBufferStore, createDataCloneError, new WeakSet(), getNativeContext, isNativeContext);
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
const mediaElementAudioSourceNodeConstructor: TMediaElementAudioSourceNodeConstructor = createMediaElementAudioSourceNodeConstructor(
    audioNodeConstructor,
    createNativeMediaElementAudioSourceNode,
    getNativeContext
);
const mediaStreamAudioDestinationNodeConstructor: TMediaStreamAudioDestinationNodeConstructor =
    createMediaStreamAudioDestinationNodeConstructor(
        audioNodeConstructor,
        createNativeMediaStreamAudioDestinationNode,
        getNativeContext,
        isNativeOfflineAudioContext
    );
const mediaStreamAudioSourceNodeConstructor: TMediaStreamAudioSourceNodeConstructor = createMediaStreamAudioSourceNodeConstructor(
    audioNodeConstructor,
    createNativeMediaStreamAudioSourceNode,
    getNativeContext
);
const createNativeMediaStreamTrackAudioSourceNode = createNativeMediaStreamTrackAudioSourceNodeFactory(createInvalidStateError);
const mediaStreamTrackAudioSourceNodeConstructor: TMediaStreamTrackAudioSourceNodeConstructor =
    createMediaStreamTrackAudioSourceNodeConstructor(audioNodeConstructor, createNativeMediaStreamTrackAudioSourceNode, getNativeContext);
const audioContextConstructor: TAudioContextConstructor = createAudioContextConstructor(
    baseAudioContextConstructor,
    createInvalidStateError,
    mediaElementAudioSourceNodeConstructor,
    mediaStreamAudioDestinationNodeConstructor,
    mediaStreamAudioSourceNodeConstructor,
    mediaStreamTrackAudioSourceNodeConstructor,
    nativeAudioContextConstructor
);

type audioContextConstructor = IAudioContext;

export { audioContextConstructor as AudioContext };

const getUnrenderedAudioWorkletNodes = createGetUnrenderedAudioWorkletNodes(unrenderedAudioWorkletNodeStore);
const addUnrenderedAudioWorkletNode = createAddUnrenderedAudioWorkletNode(getUnrenderedAudioWorkletNodes);
const deleteUnrenderedAudioWorkletNode = createDeleteUnrenderedAudioWorkletNode(getUnrenderedAudioWorkletNodes);
const activeAudioWorkletNodeInputsStore: TActiveAudioWorkletNodeInputsStore = new WeakMap();
const createNativeAudioWorkletNode = createNativeAudioWorkletNodeFactory(createNotSupportedError);
const createAudioWorkletNodeRenderer = createAudioWorkletNodeRendererFactory(
    connectAudioParam,
    deleteUnrenderedAudioWorkletNode,
    getNativeAudioNode,
    nativeAudioWorkletNodeConstructor,
    renderInputsOfAudioNode
);
const getBackupOfflineAudioContext = createGetBackupOfflineAudioContext(backupOfflineAudioContextStore);
const setActiveAudioWorkletNodeInputs = createSetActiveAudioWorkletNodeInputs(activeAudioWorkletNodeInputsStore);

// The AudioWorkletNode constructor is only available in a SecureContext.
const audioWorkletNodeConstructor: undefined | TAudioWorkletNodeConstructor = isSecureContext
    ? createAudioWorkletNodeConstructor(
          addUnrenderedAudioWorkletNode,
          audioNodeConstructor,
          createAudioParam,
          createAudioWorkletNodeRenderer,
          createNativeAudioWorkletNode,
          getAudioNodeConnections,
          getBackupOfflineAudioContext,
          getNativeContext,
          isNativeOfflineAudioContext,
          nativeAudioWorkletNodeConstructor,
          setActiveAudioWorkletNodeInputs,
          testAudioWorkletNodeOptionsClonability,
          wrapEventListener
      )
    : undefined;

type audioWorkletNodeConstructor<T extends TContext> = undefined | IAudioWorkletNode<T>;

export { audioWorkletNodeConstructor as AudioWorkletNode };

type biquadFilterNodeConstructor<T extends TContext> = IBiquadFilterNode<T>;

export { biquadFilterNodeConstructor as BiquadFilterNode };

type channelMergerNodeConstructor<T extends TContext> = IAudioNode<T>;

export { channelMergerNodeConstructor as ChannelMergerNode };

type channelSplitterNodeConstructor<T extends TContext> = IAudioNode<T>;

export { channelSplitterNodeConstructor as ChannelSplitterNode };

type constantSourceNodeConstructor<T extends TContext> = IConstantSourceNode<T>;

export { constantSourceNodeConstructor as ConstantSourceNode };

type convolverNodeConstructor<T extends TContext> = IConvolverNode<T>;

export { convolverNodeConstructor as ConvolverNode };

type delayNodeConstructor<T extends TContext> = IDelayNode<T>;

export { delayNodeConstructor as DelayNode };

type dynamicsCompressorNodeConstructor<T extends TContext> = IDynamicsCompressorNode<T>;

export { dynamicsCompressorNodeConstructor as DynamicsCompressorNode };

type gainNodeConstructor<T extends TContext> = IGainNode<T>;

export { gainNodeConstructor as GainNode };

type iIRFilterNodeConstructor<T extends TContext> = IIIRFilterNode<T>;

export { iIRFilterNodeConstructor as IIRFilterNode };

type mediaElementAudioSourceNodeConstructor<T extends IAudioContext | IMinimalAudioContext> = IMediaElementAudioSourceNode<T>;

export { mediaElementAudioSourceNodeConstructor as MediaElementAudioSourceNode };

type mediaStreamAudioDestinationNodeConstructor<T extends IAudioContext | IMinimalAudioContext> = IMediaStreamAudioDestinationNode<T>;

export { mediaStreamAudioDestinationNodeConstructor as MediaStreamAudioDestinationNode };

type mediaStreamAudioSourceNodeConstructor<T extends IAudioContext | IMinimalAudioContext> = IMediaStreamAudioSourceNode<T>;

export { mediaStreamAudioSourceNodeConstructor as MediaStreamAudioSourceNode };

type mediaStreamTrackAudioSourceNodeConstructor<T extends IAudioContext | IMinimalAudioContext> = IMediaStreamTrackAudioSourceNode<T>;

export { mediaStreamTrackAudioSourceNodeConstructor as MediaStreamTrackAudioSourceNode };

const minimalAudioContextConstructor: TMinimalAudioContextConstructor = createMinimalAudioContextConstructor(
    createInvalidStateError,
    minimalBaseAudioContextConstructor,
    nativeAudioContextConstructor
);

type minimalAudioContextConstructor = IMinimalAudioContext;

export { minimalAudioContextConstructor as MinimalAudioContext };

const createNativeOfflineAudioContext = createCreateNativeOfflineAudioContext(nativeOfflineAudioContextConstructor);
const startRendering = createStartRendering(audioBufferStore, getAudioNodeRenderer, getUnrenderedAudioWorkletNodes);
const minimalOfflineAudioContextConstructor: TMinimalOfflineAudioContextConstructor = createMinimalOfflineAudioContextConstructor(
    createInvalidStateError,
    createNativeOfflineAudioContext,
    minimalBaseAudioContextConstructor,
    startRendering
);

type minimalOfflineAudioContextConstructor = IMinimalOfflineAudioContext;

export { minimalOfflineAudioContextConstructor as MinimalOfflineAudioContext };

const offlineAudioContextConstructor: IOfflineAudioContextConstructor = createOfflineAudioContextConstructor(
    baseAudioContextConstructor,
    createInvalidStateError,
    createNativeOfflineAudioContext,
    startRendering
);

type offlineAudioContextConstructor = IOfflineAudioContext;

export { offlineAudioContextConstructor as OfflineAudioContext };

type oscillatorNodeConstructor<T extends TContext> = IOscillatorNode<T>;

export { oscillatorNodeConstructor as OscillatorNode };

type pannerNodeConstructor<T extends TContext> = IPannerNode<T>;

export { pannerNodeConstructor as PannerNode };

type periodicWaveConstructor = IPeriodicWave;

export { periodicWaveConstructor as PeriodicWave };

type stereoPannerNodeConstructor<T extends TContext> = IStereoPannerNode<T>;

export { stereoPannerNodeConstructor as StereoPannerNode };

type waveShaperNodeConstructor<T extends TContext> = IWaveShaperNode<T>;

export { waveShaperNodeConstructor as WaveShaperNode };

export { addAudioWorkletModule };

export { decodeAudioData };

export const isAnyAudioContext = createIsAnyAudioContext(CONTEXT_STORE, isNativeAudioContext);

export const isAnyAudioNode = createIsAnyAudioNode(AUDIO_NODE_STORE, isNativeAudioNode);

export const isAnyAudioParam = createIsAnyAudioParam(AUDIO_PARAM_STORE, isNativeAudioParam);

export const isAnyOfflineAudioContext = createIsAnyOfflineAudioContext(CONTEXT_STORE, isNativeOfflineAudioContext);

export const isSupported = () =>
    createIsSupportedPromise(
        cacheTestResult,
        createTestAudioBufferConstructorSupport(nativeAudioBufferConstructor),
        createTestAudioBufferCopyChannelMethodsOutOfBoundsSupport(nativeOfflineAudioContextConstructor),
        createTestAudioBufferCopyChannelMethodsSubarraySupport(nativeOfflineAudioContextConstructor),
        createTestAudioBufferSourceNodeBufferReassignmentSupport(nativeOfflineAudioContextConstructor),
        createTestAudioBufferFactoryMethodSupport(nativeOfflineAudioContextConstructor),
        createTestAudioContextCloseMethodSupport(nativeAudioContextConstructor),
        createTestAudioContextDecodeAudioDataMethodTypeErrorSupport(nativeOfflineAudioContextConstructor),
        createTestAudioContextGetOutputTimestampSupport(nativeAudioContextConstructor),
        createTestAudioContextOptionsSupport(nativeAudioContextConstructor),
        createTestAudioContextResumeSupport(nativeAudioContextConstructor),
        createTestAudioNodeConnectMethodChainabilitySupport(nativeOfflineAudioContextConstructor),
        createTestAudioNodeConnectMethodVerificationSupport(nativeOfflineAudioContextConstructor),
        createTestAudioParamValueSetterSupport(nativeOfflineAudioContextConstructor),
        createTestAudioWorkletAddModuleMethodSupport(nativeOfflineAudioContextConstructor),
        createTestAudioWorkletNodeConstructorSupport(isSecureContext, nativeAudioWorkletNodeConstructor),
        createTestAudioWorkletProcessorNoInputsSupport(nativeAudioWorkletNodeConstructor, nativeOfflineAudioContextConstructor),
        createTestAudioWorkletProcessorNoOutputsSupport(nativeAudioWorkletNodeConstructor, nativeOfflineAudioContextConstructor),
        createTestBiquadFilterNodeGetFrequencyResponseMethodSupport(nativeOfflineAudioContextConstructor),
        createTestChannelMergerNodeChannelCountSupport(nativeOfflineAudioContextConstructor),
        createTestConstantSourceNodeAccurateSchedulingSupport(nativeOfflineAudioContextConstructor),
        createTestConvolverNodeBufferReassignabilitySupport(nativeOfflineAudioContextConstructor),
        createTestConvolverNodeChannelCountSupport(nativeOfflineAudioContextConstructor),
        testDomExceptionConstructorSupport,
        testErrorEventErrorPropertySupport,
        createTestIsSecureContextSupport(window),
        createTestMediaStreamAudioSourceNodeMediaStreamWithoutAudioTrackSupport(nativeAudioContextConstructor),
        createTestPeriodicWaveConstructorSupport(nativeOfflineAudioContextConstructor, createNativePeriodicWaveConstructor(window)),
        createTestStereoPannerNodeDefaultValueSupport(nativeOfflineAudioContextConstructor),
        testTransferablesSupport
    );
