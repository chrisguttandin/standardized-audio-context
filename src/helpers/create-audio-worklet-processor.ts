import { IAudioWorkletNodeOptions, IAudioWorkletProcessor, IAudioWorkletProcessorConstructor } from '../interfaces';
import { cloneAudioWorkletNodeOptions } from './clone-audio-worklet-node-options';

export const createAudioWorkletProcessor = async (
    processorDefinition: IAudioWorkletProcessorConstructor,
    audioWorkletNodeOptions: IAudioWorkletNodeOptions
): Promise<IAudioWorkletProcessor> => {
    const clonedAudioWorkletNodeOptions = await cloneAudioWorkletNodeOptions(audioWorkletNodeOptions);

    return new processorDefinition(clonedAudioWorkletNodeOptions);
};
