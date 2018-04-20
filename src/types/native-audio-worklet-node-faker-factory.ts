import { IAudioWorkletNodeOptions, IAudioWorkletProcessorConstructor, INativeAudioWorkletNodeFaker } from '../interfaces';
import { TNativeContext } from './native-context';

export type TNativeAudioWorkletNodeFakerFactory = (
    nativeContext: TNativeContext,
    processorDefinition: IAudioWorkletProcessorConstructor,
    options: { outputChannelCount: number[] } & IAudioWorkletNodeOptions
) => INativeAudioWorkletNodeFaker;
