import { IAudioWorkletNodeOptions, IAudioWorkletProcessorConstructor, INativeAudioWorkletNodeConstructor } from '../interfaces';
import { TNativeAudioWorkletNode } from './native-audio-worklet-node';
import { TNativeContext } from './native-context';

export type TNativeAudioWorkletNodeFactory = (
    nativeContext: TNativeContext,
    nativeAudioWorkletNodeConstructor: null | INativeAudioWorkletNodeConstructor,
    name: string,
    processorDefinition: undefined | IAudioWorkletProcessorConstructor,
    options: { outputChannelCount: number[] } & IAudioWorkletNodeOptions
) => TNativeAudioWorkletNode;
