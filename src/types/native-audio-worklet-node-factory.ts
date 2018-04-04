import {
    IAudioWorkletNodeOptions,
    IAudioWorkletProcessorConstructor,
    INativeAudioWorkletNode,
    INativeAudioWorkletNodeConstructor
} from '../interfaces';
import { TNativeAudioContext } from './native-audio-context';
import { TNativeOfflineAudioContext } from './native-offline-audio-context';

export type TNativeAudioWorkletNodeFactory = (
    nativeContext: TNativeAudioContext | TNativeOfflineAudioContext,
    nativeAudioWorkletNodeConstructor: null | INativeAudioWorkletNodeConstructor,
    name: string,
    processorDefinition: undefined | IAudioWorkletProcessorConstructor,
    options: { outputChannelCount: number[] } & IAudioWorkletNodeOptions
) => INativeAudioWorkletNode;
