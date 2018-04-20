import {
    IAudioWorkletNodeOptions,
    IAudioWorkletProcessorConstructor,
    INativeAudioWorkletNode,
    INativeAudioWorkletNodeConstructor
} from '../interfaces';
import { TNativeContext } from './native-context';

export type TNativeAudioWorkletNodeFactory = (
    nativeContext: TNativeContext,
    nativeAudioWorkletNodeConstructor: null | INativeAudioWorkletNodeConstructor,
    name: string,
    processorDefinition: undefined | IAudioWorkletProcessorConstructor,
    options: { outputChannelCount: number[] } & IAudioWorkletNodeOptions
) => INativeAudioWorkletNode;
