import {
    IAudioNodeRenderer,
    IAudioWorkletNode,
    IAudioWorkletNodeOptions,
    IAudioWorkletProcessorConstructor,
    IMinimalOfflineAudioContext
} from '../interfaces';

export type TAudioWorkletNodeRendererFactory = <T extends IMinimalOfflineAudioContext>(
    name: string,
    options: { outputChannelCount: number[] } & IAudioWorkletNodeOptions,
    processorDefinition: undefined | IAudioWorkletProcessorConstructor
) => IAudioNodeRenderer<T, IAudioWorkletNode<T>>;
