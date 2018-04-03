import browsernizr from './browsernizr';
import { createAnalyserNodeConstructor } from './factories/analyser-node-constructor';
import { createAnalyserNodeRendererFactory } from './factories/analyser-node-renderer-factory';
import { createAudioBufferConstructor } from './factories/audio-buffer-constructor';
import { createAudioBufferSourceNodeConstructor } from './factories/audio-buffer-source-node-constructor';
import { createAudioBufferSourceNodeRendererFactory } from './factories/audio-buffer-source-node-renderer-factory';
import { createAudioContextConstructor } from './factories/audio-context-constructor';
import { createAudioDestinationNodeConstructor } from './factories/audio-destination-node-constructor';
import { createAudioDestinationNodeRenderer } from './factories/audio-destination-node-renderer-factory';
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
import { createDisconnectMultipleOutputs } from './factories/disconnect-multiple-outputs';
import { createGainNodeConstructor } from './factories/gain-node-constructor';
import { createGainNodeRendererFactory } from './factories/gain-node-renderer-factory';
import { createIIRFilterNodeConstructor } from './factories/iir-filter-node-constructor';
import { createIIRFilterNodeRendererFactory } from './factories/iir-filter-node-renderer-factory';
import { createIndexSizeError } from './factories/index-size-error';
import { createInvalidAccessError } from './factories/invalid-access-error';
import { createInvalidStateError } from './factories/invalid-state-error';
import { createIsNativeOfflineAudioContext } from './factories/is-native-offline-audio-context';
import { createIsSupportedPromise } from './factories/is-supported-promise';
import { createMediaElementAudioSourceNodeConstructor } from './factories/media-element-audio-source-node-constructor';
import { createMediaStreamAudioSourceNodeConstructor } from './factories/media-stream-audio-source-node-constructor';
import { createMinimalAudioContextConstructor } from './factories/minimal-audio-context-constructor';
import { createMinimalBaseAudioContextConstructor } from './factories/minimal-base-audio-context-constructor';
import { createMinimalOfflineAudioContextConstructor } from './factories/minimal-offline-audio-context-constructor';
import { createNativeAnalyserNode } from './factories/native-analyser-node';
import { createNativeAudioBufferSourceNode } from './factories/native-audio-buffer-source-node';
import { createNativeAudioDestinationNode } from './factories/native-audio-destination-node';
import { createNativeAudioWorkletNodeConstructor } from './factories/native-audio-worklet-node-constructor';
import { createNativeAudioWorkletNodeFactory } from './factories/native-audio-worklet-node-factory';
import { createNativeAudioWorkletNodeFakerFactory } from './factories/native-audio-worklet-node-faker-factory';
import { createNativeBiquadFilterNode } from './factories/native-biquad-filter-node';
import { createNativeChannelMergerNode } from './factories/native-channel-merger-node';
import { createNativeChannelSplitterNode } from './factories/native-channel-splitter-node';
import { createNativeConstantSourceNodeFactory } from './factories/native-constant-source-node-factory';
import { createNativeConstantSourceNodeFakerFactory } from './factories/native-constant-source-node-faker-factory';
import { createNativeGainNode } from './factories/native-gain-node';
import { createNativeIIRFilterNodeFactory } from './factories/native-iir-filter-node-factory';
import { createNativeIIRFilterNodeFakerFactory } from './factories/native-iir-filter-node-faker-factory';
import { createNativeOscillatorNode } from './factories/native-oscillator-node';
import { createNoneAudioDestinationNodeConstructor } from './factories/none-audio-destination-node-constructor';
import { createNotSupportedError } from './factories/not-supported-error';
import { createOfflineAudioContextConstructor } from './factories/offline-audio-context-constructor';
import { createOscillatorNodeConstructor } from './factories/oscillator-node-constructor';
import { createOscillatorNodeRendererFactory } from './factories/oscillator-node-renderer-factory';
import { createRenderNativeOfflineAudioContext } from './factories/render-native-offline-audio-context';
import { createStartRendering } from './factories/start-rendering';
import { createTestAudioContextCloseMethodSupport } from './factories/test-audio-context-close-method';
import {
    createTestAudioContextDecodeAudioDataMethodTypeErrorSupport
} from './factories/test-audio-context-decode-audio-data-method-type-error';
import { createTestAudioContextOptionsSupport } from './factories/test-audio-context-options';
import { createTestChannelMergerNodeSupport } from './factories/test-channel-merger-node';
import { createUnpatchedAudioContextConstructor } from './factories/unpatched-audio-context-constructor';
import { createUnpatchedOfflineAudioContextConstructor } from './factories/unpatched-offline-audio-context-constructor';
import { createWindow } from './factories/window';
import {
    IAnalyserNodeConstructor,
    IAudioBufferConstructor,
    IAudioBufferSourceNodeConstructor,
    IAudioContextConstructor,
    IAudioWorkletNodeConstructor,
    IBiquadFilterNodeConstructor,
    IChannelMergerNodeConstructor,
    IChannelSplitterNodeConstructor,
    IConstantSourceNodeConstructor,
    IGainNodeConstructor,
    IIIRFilterNodeConstructor,
    IMediaElementAudioSourceNodeConstructor,
    IMediaStreamAudioSourceNodeConstructor,
    IMinimalAudioContextConstructor,
    IMinimalOfflineAudioContextConstructor,
    IOfflineAudioContextConstructor,
    IOscillatorNodeConstructor
} from './interfaces';

export * from './interfaces';
export * from './types';

const window = createWindow();
const unpatchedOfflineAudioContextConstructor = createUnpatchedOfflineAudioContextConstructor(window);
const isNativeOfflineAudioContext = createIsNativeOfflineAudioContext(unpatchedOfflineAudioContextConstructor);
const audioNodeConstructor = createAudioNodeConstructor(createInvalidAccessError, isNativeOfflineAudioContext);
const noneAudioDestinationNodeConstructor = createNoneAudioDestinationNodeConstructor(
    audioNodeConstructor,
    createInvalidStateError
);
const createAnalyserNodeRenderer = createAnalyserNodeRendererFactory(createNativeAnalyserNode);
const analyserNodeConstructor: IAnalyserNodeConstructor = createAnalyserNodeConstructor(
    createAnalyserNodeRenderer,
    createNativeAnalyserNode,
    isNativeOfflineAudioContext,
    noneAudioDestinationNodeConstructor
);

export { analyserNodeConstructor as AnalyserNode };

const audioBufferConstructor: IAudioBufferConstructor = createAudioBufferConstructor(unpatchedOfflineAudioContextConstructor);

export { audioBufferConstructor as AudioBuffer };

const createAudioBufferSourceNodeRenderer = createAudioBufferSourceNodeRendererFactory(createNativeAudioBufferSourceNode);
const createAudioParam = createAudioParamFactory(createAudioParamRenderer);
const audioBufferSourceNodeConstructor: IAudioBufferSourceNodeConstructor = createAudioBufferSourceNodeConstructor(
    createAudioBufferSourceNodeRenderer,
    createAudioParam,
    createInvalidStateError,
    createNativeAudioBufferSourceNode,
    isNativeOfflineAudioContext,
    noneAudioDestinationNodeConstructor
);

export { audioBufferSourceNodeConstructor as AudioBufferSourceNode };

const audioDestinationNodeConstructor = createAudioDestinationNodeConstructor(
    audioNodeConstructor,
    createAudioDestinationNodeRenderer,
    createIndexSizeError,
    createInvalidStateError,
    createNativeAudioDestinationNode,
    isNativeOfflineAudioContext
);
const createBiquadFilterNodeRenderer = createBiquadFilterNodeRendererFactory(createNativeBiquadFilterNode);
const biquadFilterNodeConstructor: IBiquadFilterNodeConstructor = createBiquadFilterNodeConstructor(
    createAudioParam,
    createBiquadFilterNodeRenderer,
    createInvalidAccessError,
    createNativeBiquadFilterNode,
    isNativeOfflineAudioContext,
    noneAudioDestinationNodeConstructor
);
const createChannelMergerNodeRenderer = createChannelMergerNodeRendererFactory(createNativeChannelMergerNode);
const channelMergerNodeConstructor: IChannelMergerNodeConstructor = createChannelMergerNodeConstructor(
    createChannelMergerNodeRenderer,
    createNativeChannelMergerNode,
    isNativeOfflineAudioContext,
    noneAudioDestinationNodeConstructor
);
const createChannelSplitterNodeRenderer = createChannelSplitterNodeRendererFactory(createNativeChannelSplitterNode);
const channelSplitterNodeConstructor: IChannelSplitterNodeConstructor = createChannelSplitterNodeConstructor(
    createChannelSplitterNodeRenderer,
    createNativeChannelSplitterNode,
    isNativeOfflineAudioContext,
    noneAudioDestinationNodeConstructor
);
const createNativeConstantSourceNodeFaker = createNativeConstantSourceNodeFakerFactory(
    createNativeAudioBufferSourceNode,
    createNativeGainNode
);
const createNativeConstantSourceNode = createNativeConstantSourceNodeFactory(createNativeConstantSourceNodeFaker);
const createConstantSourceNodeRenderer = createConstantSourceNodeRendererFactory(createNativeConstantSourceNode);
const constantSourceNodeConstructor: IConstantSourceNodeConstructor = createConstantSourceNodeConstructor(
    createAudioParam,
    createConstantSourceNodeRenderer,
    createNativeConstantSourceNode,
    isNativeOfflineAudioContext,
    noneAudioDestinationNodeConstructor
);
const createGainNodeRenderer = createGainNodeRendererFactory(createNativeGainNode);
const gainNodeConstructor: IGainNodeConstructor = createGainNodeConstructor(
    createAudioParam,
    createGainNodeRenderer,
    createNativeGainNode,
    isNativeOfflineAudioContext,
    noneAudioDestinationNodeConstructor
);
const renderNativeOfflineAudioContext = createRenderNativeOfflineAudioContext(createNativeGainNode);
const createIIRFilterNodeRenderer = createIIRFilterNodeRendererFactory(
    createNativeAudioBufferSourceNode,
    renderNativeOfflineAudioContext,
    unpatchedOfflineAudioContextConstructor
);
const createNativeIIRFilterNodeFaker = createNativeIIRFilterNodeFakerFactory(
    createInvalidAccessError,
    createInvalidStateError,
    createNotSupportedError
);
const createNativeIIRFilterNode = createNativeIIRFilterNodeFactory(createNativeIIRFilterNodeFaker);
const iIRFilterNodeConstructor: IIIRFilterNodeConstructor = createIIRFilterNodeConstructor(
    createNativeIIRFilterNode,
    createIIRFilterNodeRenderer,
    isNativeOfflineAudioContext,
    noneAudioDestinationNodeConstructor
);
const minimalBaseAudioContextConstructor = createMinimalBaseAudioContextConstructor(audioDestinationNodeConstructor);
const createOscillatorNodeRenderer = createOscillatorNodeRendererFactory(createNativeOscillatorNode);
const oscillatorNodeConstructor: IOscillatorNodeConstructor = createOscillatorNodeConstructor(
    createAudioParam,
    createInvalidStateError,
    createNativeOscillatorNode,
    createOscillatorNodeRenderer,
    isNativeOfflineAudioContext,
    noneAudioDestinationNodeConstructor
);
const baseAudioContextConstructor = createBaseAudioContextConstructor(
    analyserNodeConstructor,
    audioBufferConstructor,
    audioBufferSourceNodeConstructor,
    biquadFilterNodeConstructor,
    channelMergerNodeConstructor,
    channelSplitterNodeConstructor,
    constantSourceNodeConstructor,
    gainNodeConstructor,
    iIRFilterNodeConstructor,
    minimalBaseAudioContextConstructor,
    oscillatorNodeConstructor
);
const mediaElementAudioSourceNodeConstructor: IMediaElementAudioSourceNodeConstructor = createMediaElementAudioSourceNodeConstructor(
    noneAudioDestinationNodeConstructor
);
const mediaStreamAudioSourceNodeConstructor: IMediaStreamAudioSourceNodeConstructor = createMediaStreamAudioSourceNodeConstructor(
    noneAudioDestinationNodeConstructor
);
const unpatchedAudioContextConstructor = createUnpatchedAudioContextConstructor(window);
const audioContextConstructor: IAudioContextConstructor = createAudioContextConstructor(
    baseAudioContextConstructor,
    createInvalidStateError,
    mediaElementAudioSourceNodeConstructor,
    mediaStreamAudioSourceNodeConstructor,
    unpatchedAudioContextConstructor
);

export { audioContextConstructor as AudioContext };

const connectMultipleOutputs = createConnectMultipleOutputs(createIndexSizeError);
const disconnectMultipleOutputs = createDisconnectMultipleOutputs(createIndexSizeError);
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
    renderNativeOfflineAudioContext,
    unpatchedOfflineAudioContextConstructor
);
const createNativeAudioWorkletNodeFaker = createNativeAudioWorkletNodeFakerFactory(
    connectMultipleOutputs,
    createIndexSizeError,
    createInvalidStateError,
    createNativeChannelMergerNode,
    createNativeChannelSplitterNode,
    createNativeConstantSourceNode,
    createNativeGainNode,
    createNotSupportedError,
    disconnectMultipleOutputs
);
const createNativeAudioWorkletNode = createNativeAudioWorkletNodeFactory(
    createInvalidStateError,
    createNativeAudioWorkletNodeFaker,
    createNotSupportedError
);
const audioWorkletNodeConstructor: IAudioWorkletNodeConstructor = createAudioWorkletNodeConstructor(
    createAudioParam,
    createAudioWorkletNodeRenderer,
    createNativeAudioWorkletNode,
    isNativeOfflineAudioContext,
    nativeAudioWorkletNodeConstructor,
    noneAudioDestinationNodeConstructor
);

export { audioWorkletNodeConstructor as AudioWorkletNode };

export { biquadFilterNodeConstructor as BiquadFilterNode };

export { channelMergerNodeConstructor as ChannelMergerNode };

export { channelSplitterNodeConstructor as ChannelSplitterNode };

export { constantSourceNodeConstructor as ConstantSourceNode };

export { gainNodeConstructor as GainNode };

export { iIRFilterNodeConstructor as IIRFilterNode };

const minimalAudioContextConstructor: IMinimalAudioContextConstructor = createMinimalAudioContextConstructor(
    createInvalidStateError,
    minimalBaseAudioContextConstructor,
    unpatchedAudioContextConstructor
);

export { mediaElementAudioSourceNodeConstructor as MediaElementAudioSourceNode };

export { mediaStreamAudioSourceNodeConstructor as MediaStreamAudioSourceNode };

export { minimalAudioContextConstructor as MinimalAudioContext };

const startRendering = createStartRendering(renderNativeOfflineAudioContext);
const minimalOfflineAudioContextConstructor: IMinimalOfflineAudioContextConstructor = createMinimalOfflineAudioContextConstructor(
    minimalBaseAudioContextConstructor,
    startRendering,
    unpatchedOfflineAudioContextConstructor
);

export { minimalOfflineAudioContextConstructor as MinimalOfflineAudioContext };

const offlineAudioContextConstructor: IOfflineAudioContextConstructor = createOfflineAudioContextConstructor(
    baseAudioContextConstructor,
    startRendering,
    unpatchedOfflineAudioContextConstructor
);

export { offlineAudioContextConstructor as OfflineAudioContext };

export { oscillatorNodeConstructor as OscillatorNode };

export { addAudioWorkletModule } from './add-audio-worklet-module';

export { decodeAudioData } from './decode-audio-data';

export const isSupported = () => createIsSupportedPromise(
    browsernizr,
    createTestAudioContextCloseMethodSupport(unpatchedAudioContextConstructor),
    createTestAudioContextDecodeAudioDataMethodTypeErrorSupport(unpatchedOfflineAudioContextConstructor),
    createTestAudioContextOptionsSupport(unpatchedAudioContextConstructor),
    createTestChannelMergerNodeSupport(unpatchedAudioContextConstructor)
);
