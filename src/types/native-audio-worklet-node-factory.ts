import { IAudioWorkletNodeOptions, IAudioWorkletProcessorConstructor } from '../interfaces';
import { TNativeAudioWorkletNode } from './native-audio-worklet-node';
import { TNativeAudioWorkletNodeConstructor } from './native-audio-worklet-node-constructor';
import { TNativeContext } from './native-context';

export type TNativeAudioWorkletNodeFactory = (
    nativeContext: TNativeContext,
    nativeAudioWorkletNodeConstructor: null | TNativeAudioWorkletNodeConstructor,
    name: string,
    processorDefinition: undefined | IAudioWorkletProcessorConstructor,
    options: { outputChannelCount: number[] } & IAudioWorkletNodeOptions
) => TNativeAudioWorkletNode;
