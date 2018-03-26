import { IAudioNodeOptions } from '../interfaces';
import { TNativeAudioNode } from '../types';

export const assignNativeAudioNodeOptions = (nativeAudioNode: TNativeAudioNode, options: Partial<IAudioNodeOptions> = { }): void => {
    if (options.channelCount !== undefined) {
        nativeAudioNode.channelCount = options.channelCount;
    }

    if (options.channelCountMode !== undefined) {
        nativeAudioNode.channelCountMode = options.channelCountMode;
    }

    if (options.channelInterpretation !== undefined) {
        nativeAudioNode.channelInterpretation = options.channelInterpretation;
    }
};
