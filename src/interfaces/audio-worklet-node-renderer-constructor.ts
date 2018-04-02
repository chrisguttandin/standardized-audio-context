import { IAudioNodeRenderer } from './audio-node-renderer';
import { IAudioWorkletNode } from './audio-worklet-node';
import { IAudioWorkletNodeOptions } from './audio-worklet-node-options';
import { IAudioWorkletProcessorConstructor } from './audio-worklet-processor-constructor';

export interface IAudioWorkletNodeRendererConstructor {

    new (
        proxy: IAudioWorkletNode,
        name: string,
        options: { outputChannelCount: number[] } & IAudioWorkletNodeOptions,
        processorDefinition: undefined | IAudioWorkletProcessorConstructor
    ): IAudioNodeRenderer;

}
