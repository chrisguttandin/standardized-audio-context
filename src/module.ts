import { Injector } from '@angular/core';
import browsernizr from './browsernizr';
import { createAnalyserNodeConstructor } from './factories/analyser-node-constructor';
import { createAudioBufferConstructor } from './factories/audio-buffer-constructor';
import { createAudioBufferSourceNodeConstructor } from './factories/audio-buffer-source-node-constructor';
import { createAudioContextConstructor } from './factories/audio-context-constructor';
import { createAudioDestinationNodeConstructor } from './factories/audio-destination-node-constructor';
import { createAudioNodeConstructor } from './factories/audio-node-constructor';
import { createAudioWorkletNodeConstructor } from './factories/audio-worklet-node-constructor';
import { createBaseAudioContextConstructor } from './factories/base-audio-context-constructor';
import { createBiquadFilterNodeConstructor } from './factories/biquad-filter-node-constructor';
import { createChannelMergerNodeConstructor } from './factories/channel-merger-node-constructor';
import { createChannelSplitterNodeConstructor } from './factories/channel-splitter-node-constructor';
import { createConstantSourceNodeConstructor } from './factories/constant-source-node-constructor';
import { createGainNodeConstructor } from './factories/gain-node-constructor';
import { createIIRFilterNodeConstructor } from './factories/iir-filter-node-constructor';
import { createIsNativeOfflineAudioContext } from './factories/is-native-offline-audio-context';
import { createIsSupportedPromise } from './factories/is-supported-promise';
import { createMediaElementAudioSourceNodeConstructor } from './factories/media-element-audio-source-node-constructor';
import { createMediaStreamAudioSourceNodeConstructor } from './factories/media-stream-audio-source-node-constructor';
import { createMinimalAudioContextConstructor } from './factories/minimal-audio-context-constructor';
import { createMinimalBaseAudioContextConstructor } from './factories/minimal-base-audio-context-constructor';
import { createMinimalOfflineAudioContextConstructor } from './factories/minimal-offline-audio-context-constructor';
import { createNoneAudioDestinationNodeConstructor } from './factories/none-audio-destination-node-constructor';
import { createOfflineAudioContextConstructor } from './factories/offline-audio-context-constructor';
import { createOscillatorNodeConstructor } from './factories/oscillator-node-constructor';
import { createTestAudioContextCloseMethodSupport } from './factories/test-audio-context-close-method';
import {
    createTestAudioContextDecodeAudioDataMethodTypeErrorSupport
} from './factories/test-audio-context-decode-audio-data-method-type-error';
import { createTestAudioContextOptionsSupport } from './factories/test-audio-context-options';
import { createTestChannelMergerNodeSupport } from './factories/test-channel-merger-node';
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
import {
    NATIVE_AUDIO_WORKLET_NODE_CONSTRUCTOR_PROVIDER,
    nativeAudioWorkletNodeConstructor
} from './providers/native-audio-worklet-node-constructor';
import {
    UNPATCHED_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER,
    unpatchedAudioContextConstructor
} from './providers/unpatched-audio-context-constructor';
import {
    UNPATCHED_OFFLINE_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER,
    unpatchedOfflineAudioContextConstructor
} from './providers/unpatched-offline-audio-context-constructor';
import { WINDOW_PROVIDER } from './providers/window';

const injector = Injector.create({
    providers: [
        NATIVE_AUDIO_WORKLET_NODE_CONSTRUCTOR_PROVIDER,
        UNPATCHED_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER,
        UNPATCHED_OFFLINE_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER,
        WINDOW_PROVIDER
    ]
});

const ntvDWrkltNdCnstrctr = injector.get(nativeAudioWorkletNodeConstructor);
const nptchdDCntxtCnstrctr = injector.get(unpatchedAudioContextConstructor);
const nptchdFFlnDCntxtCnstrctr = injector.get(unpatchedOfflineAudioContextConstructor);

export * from './interfaces';
export * from './types';

const isNativeOfflineAudioContext = createIsNativeOfflineAudioContext(nptchdFFlnDCntxtCnstrctr);
const audioNodeConstructor = createAudioNodeConstructor(isNativeOfflineAudioContext);
const noneAudioDestinationNodeConstructor = createNoneAudioDestinationNodeConstructor(audioNodeConstructor);
const analyserNodeConstructor: IAnalyserNodeConstructor = createAnalyserNodeConstructor(
    isNativeOfflineAudioContext,
    noneAudioDestinationNodeConstructor
);

export { analyserNodeConstructor as AnalyserNode };

const audioBufferConstructor: IAudioBufferConstructor = createAudioBufferConstructor(nptchdFFlnDCntxtCnstrctr);

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
const iIRFilterNodeConstructor: IIIRFilterNodeConstructor = createIIRFilterNodeConstructor(
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
const audioContextConstructor: IAudioContextConstructor = createAudioContextConstructor(
    baseAudioContextConstructor,
    mediaElementAudioSourceNodeConstructor,
    mediaStreamAudioSourceNodeConstructor,
    nptchdDCntxtCnstrctr
);

export { audioContextConstructor as AudioContext };

const audioWorkletNodeConstructor: IAudioWorkletNodeConstructor = createAudioWorkletNodeConstructor(
    isNativeOfflineAudioContext,
    ntvDWrkltNdCnstrctr,
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
    nptchdDCntxtCnstrctr
);

export { mediaElementAudioSourceNodeConstructor as MediaElementAudioSourceNode };

export { mediaStreamAudioSourceNodeConstructor as MediaStreamAudioSourceNode };

export { minimalAudioContextConstructor as MinimalAudioContext };

const minimalOfflineAudioContextConstructor: IMinimalOfflineAudioContextConstructor = createMinimalOfflineAudioContextConstructor(
    minimalBaseAudioContextConstructor,
    nptchdFFlnDCntxtCnstrctr
);

export { minimalOfflineAudioContextConstructor as MinimalOfflineAudioContext };

const offlineAudioContextConstructor: IOfflineAudioContextConstructor = createOfflineAudioContextConstructor(
    baseAudioContextConstructor,
    nptchdFFlnDCntxtCnstrctr
);

export { offlineAudioContextConstructor as OfflineAudioContext };

export { oscillatorNodeConstructor as OscillatorNode };

export { addAudioWorkletModule } from './add-audio-worklet-module';

export { decodeAudioData } from './decode-audio-data';

export const isSupported = () => createIsSupportedPromise(
    browsernizr,
    createTestAudioContextCloseMethodSupport(nptchdDCntxtCnstrctr),
    createTestAudioContextDecodeAudioDataMethodTypeErrorSupport(nptchdFFlnDCntxtCnstrctr),
    createTestAudioContextOptionsSupport(nptchdDCntxtCnstrctr),
    createTestChannelMergerNodeSupport(nptchdDCntxtCnstrctr)
);
