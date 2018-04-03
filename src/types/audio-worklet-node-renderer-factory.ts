import { IAudioNodeRenderer, IAudioWorkletNodeOptions, IAudioWorkletProcessorConstructor } from '../interfaces';

export type TAudioWorkletNodeRendererFactory = (
    name: string,
    options: { outputChannelCount: number[] } & IAudioWorkletNodeOptions,
    processorDefinition: undefined | IAudioWorkletProcessorConstructor
) => IAudioNodeRenderer;
