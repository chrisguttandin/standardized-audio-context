import {
    IAudioWorkletNodeOptions,
    IAudioWorkletProcessorConstructor,
    INativeAudioWorkletNode,
    INativeAudioWorkletNodeConstructor
} from '../interfaces';
import { TUnpatchedAudioContext } from './unpatched-audio-context';
import { TUnpatchedOfflineAudioContext } from './unpatched-offline-audio-context';

export type TNativeAudioWorkletNodeFactory = (
    nativeContext: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext,
    nativeAudioWorkletNodeConstructor: null | INativeAudioWorkletNodeConstructor,
    name: string,
    processorDefinition: undefined | IAudioWorkletProcessorConstructor,
    options: { outputChannelCount: number[] } & IAudioWorkletNodeOptions
) => INativeAudioWorkletNode;
