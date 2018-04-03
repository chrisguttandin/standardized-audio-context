import { IAudioWorkletNodeOptions, IAudioWorkletProcessorConstructor, INativeAudioWorkletNodeFaker } from '../interfaces';
import { TUnpatchedAudioContext } from './unpatched-audio-context';
import { TUnpatchedOfflineAudioContext } from './unpatched-offline-audio-context';

export type TNativeAudioWorkletNodeFakerFactory = (
    unpatchedAudioContext: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext,
    processorDefinition: IAudioWorkletProcessorConstructor,
    options: { outputChannelCount: number[] } & IAudioWorkletNodeOptions
) => INativeAudioWorkletNodeFaker;
