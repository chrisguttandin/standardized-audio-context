import { NODE_TO_PROCESSOR_MAPS } from '../globals';
import { IAudioWorkletNodeOptions, IAudioWorkletProcessor, IAudioWorkletProcessorConstructor } from '../interfaces';
import { TNativeAudioWorkletNode, TNativeContext } from '../types';
import { cloneAudioWorkletNodeOptions } from './clone-audio-worklet-node-options';

const createAudioWorkletProcessorPromise = async (
    processorDefinition: IAudioWorkletProcessorConstructor,
    audioWorkletNodeOptions: IAudioWorkletNodeOptions
): Promise<IAudioWorkletProcessor> => {
    const clonedAudioWorkletNodeOptions = await cloneAudioWorkletNodeOptions(audioWorkletNodeOptions);

    return new processorDefinition(clonedAudioWorkletNodeOptions);
};

export const createAudioWorkletProcessor = (
    nativeContext: TNativeContext,
    nativeAudioWorkletNode: TNativeAudioWorkletNode,
    processorDefinition: IAudioWorkletProcessorConstructor,
    audioWorkletNodeOptions: IAudioWorkletNodeOptions
): Promise<IAudioWorkletProcessor> => {
    let nodeToProcessorMap = NODE_TO_PROCESSOR_MAPS.get(nativeContext);

    if (nodeToProcessorMap === undefined) {
        nodeToProcessorMap = new WeakMap();

        NODE_TO_PROCESSOR_MAPS.set(nativeContext, nodeToProcessorMap);
    }

    const audioWorkletProcessorPromise = createAudioWorkletProcessorPromise(processorDefinition, audioWorkletNodeOptions);

    nodeToProcessorMap.set(nativeAudioWorkletNode, audioWorkletProcessorPromise);

    return audioWorkletProcessorPromise;
};
