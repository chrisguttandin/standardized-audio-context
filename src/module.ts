import browsernizr from './browsernizr';
import { createAnalyserNodeConstructor } from './factories/analyser-node-constructor';
import { createAudioBufferConstructor } from './factories/audio-buffer-constructor';
import { createAudioBufferSourceNodeConstructor } from './factories/audio-buffer-source-node-constructor';
import { createAudioContextConstructor } from './factories/audio-context-constructor';
import { createAudioDestinationNodeConstructor } from './factories/audio-destination-node-constructor';
import { createAudioNodeConstructor } from './factories/audio-node-constructor';
import { createAudioWorkletNodeConstructor } from './factories/audio-worklet-node-constructor';
import { createAudioWorkletNodeRendererConstructor } from './factories/audio-worklet-node-renderer-constructor';
import { createBaseAudioContextConstructor } from './factories/base-audio-context-constructor';
import { createBiquadFilterNodeConstructor } from './factories/biquad-filter-node-constructor';
import { createChannelMergerNodeConstructor } from './factories/channel-merger-node-constructor';
import { createChannelSplitterNodeConstructor } from './factories/channel-splitter-node-constructor';
import { createConstantSourceNodeConstructor } from './factories/constant-source-node-constructor';
import { createGainNodeConstructor } from './factories/gain-node-constructor';
import { createIIRFilterNodeConstructor } from './factories/iir-filter-node-constructor';
import { createIIRFilterNodeRendererConstructor } from './factories/iir-filter-node-renderer-constructor';
import { createIsNativeOfflineAudioContext } from './factories/is-native-offline-audio-context';
import { createIsSupportedPromise } from './factories/is-supported-promise';
import { createMediaElementAudioSourceNodeConstructor } from './factories/media-element-audio-source-node-constructor';
import { createMediaStreamAudioSourceNodeConstructor } from './factories/media-stream-audio-source-node-constructor';
import { createMinimalAudioContextConstructor } from './factories/minimal-audio-context-constructor';
import { createMinimalBaseAudioContextConstructor } from './factories/minimal-base-audio-context-constructor';
import { createMinimalOfflineAudioContextConstructor } from './factories/minimal-offline-audio-context-constructor';
import { createNativeAudioWorkletNodeConstructor } from './factories/native-audio-worklet-node-constructor';
import { createNoneAudioDestinationNodeConstructor } from './factories/none-audio-destination-node-constructor';
import { createOfflineAudioContextConstructor } from './factories/offline-audio-context-constructor';
import { createOscillatorNodeConstructor } from './factories/oscillator-node-constructor';
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
const audioNodeConstructor = createAudioNodeConstructor(isNativeOfflineAudioContext);
const noneAudioDestinationNodeConstructor = createNoneAudioDestinationNodeConstructor(audioNodeConstructor);
const analyserNodeConstructor: IAnalyserNodeConstructor = createAnalyserNodeConstructor(
    isNativeOfflineAudioContext,
    noneAudioDestinationNodeConstructor
);

export { analyserNodeConstructor as AnalyserNode };

const audioBufferConstructor: IAudioBufferConstructor = createAudioBufferConstructor(unpatchedOfflineAudioContextConstructor);

export { audioBufferConstructor as AudioBuffer };

const audioBufferSourceNodeConstructor: IAudioBufferSourceNodeConstructor = createAudioBufferSourceNodeConstructor(
    isNativeOfflineAudioContext,
    noneAudioDestinationNodeConstructor
);

export { audioBufferSourceNodeConstructor as AudioBufferSourceNode };

const audioDestinationNodeConstructor = createAudioDestinationNodeConstructor(audioNodeConstructor, isNativeOfflineAudioContext);
const biquadFilterNodeConstructor: IBiquadFilterNodeConstructor = createBiquadFilterNodeConstructor(
    isNativeOfflineAudioContext,
    noneAudioDestinationNodeConstructor
);
const channelMergerNodeConstructor: IChannelMergerNodeConstructor = createChannelMergerNodeConstructor(
    isNativeOfflineAudioContext,
    noneAudioDestinationNodeConstructor
);
const channelSplitterNodeConstructor: IChannelSplitterNodeConstructor = createChannelSplitterNodeConstructor(
    isNativeOfflineAudioContext,
    noneAudioDestinationNodeConstructor
);
const constantSourceNodeConstructor: IConstantSourceNodeConstructor = createConstantSourceNodeConstructor(
    isNativeOfflineAudioContext,
    noneAudioDestinationNodeConstructor
);
const gainNodeConstructor: IGainNodeConstructor = createGainNodeConstructor(
    isNativeOfflineAudioContext,
    noneAudioDestinationNodeConstructor
);
const iIRFilterNodeRendererConstructor = createIIRFilterNodeRendererConstructor(unpatchedOfflineAudioContextConstructor);
const iIRFilterNodeConstructor: IIIRFilterNodeConstructor = createIIRFilterNodeConstructor(
    iIRFilterNodeRendererConstructor,
    isNativeOfflineAudioContext,
    noneAudioDestinationNodeConstructor
);
const minimalBaseAudioContextConstructor = createMinimalBaseAudioContextConstructor(audioDestinationNodeConstructor);
const oscillatorNodeConstructor: IOscillatorNodeConstructor = createOscillatorNodeConstructor(
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
    mediaElementAudioSourceNodeConstructor,
    mediaStreamAudioSourceNodeConstructor,
    unpatchedAudioContextConstructor
);

export { audioContextConstructor as AudioContext };

const nativeAudioWorkletNodeConstructor = createNativeAudioWorkletNodeConstructor(window);
const audioWorkletNodeRendererConstructor = createAudioWorkletNodeRendererConstructor(
    nativeAudioWorkletNodeConstructor,
    unpatchedOfflineAudioContextConstructor
);
const audioWorkletNodeConstructor: IAudioWorkletNodeConstructor = createAudioWorkletNodeConstructor(
    audioWorkletNodeRendererConstructor,
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
    minimalBaseAudioContextConstructor,
    unpatchedAudioContextConstructor
);

export { mediaElementAudioSourceNodeConstructor as MediaElementAudioSourceNode };

export { mediaStreamAudioSourceNodeConstructor as MediaStreamAudioSourceNode };

export { minimalAudioContextConstructor as MinimalAudioContext };

const minimalOfflineAudioContextConstructor: IMinimalOfflineAudioContextConstructor = createMinimalOfflineAudioContextConstructor(
    minimalBaseAudioContextConstructor,
    unpatchedOfflineAudioContextConstructor
);

export { minimalOfflineAudioContextConstructor as MinimalOfflineAudioContext };

const offlineAudioContextConstructor: IOfflineAudioContextConstructor = createOfflineAudioContextConstructor(
    baseAudioContextConstructor,
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
