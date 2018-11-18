import { NODE_TO_PROCESSOR_MAPS } from '../globals';
import { getNativeAudioNode } from '../helpers/get-native-audio-node';
import { IAudioNode, IAudioWorkletProcessor } from '../interfaces';
import { TNativeAudioWorkletNode, TNativeOfflineAudioContext } from '../types';

export const getAudioWorkletProcessor = (
    nativeOfflineAudioContext: TNativeOfflineAudioContext,
    proxy: IAudioNode
): Promise<IAudioWorkletProcessor> => {
    const nodeToProcessorMap = NODE_TO_PROCESSOR_MAPS.get(nativeOfflineAudioContext);

    if (nodeToProcessorMap === undefined) {
        throw new Error('Missing the processor map for the given OfflineAudioContext.');
    }

    const nativeAudioWorkletNode = getNativeAudioNode<TNativeAudioWorkletNode>(proxy);
    const audioWorkletProcessorPromise = nodeToProcessorMap.get(nativeAudioWorkletNode);

    if (audioWorkletProcessorPromise === undefined) {
        throw new Error('Missing the promise for the given AudioWorkletNode.');
    }

    return audioWorkletProcessorPromise;
};
