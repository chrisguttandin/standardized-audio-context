import { IAudioNodeOptions } from '../interfaces';
import { TNativeAudioNode } from '../types';

// @todo Use the same strategy to assign all node specific options as well.
const assignNativeAudioNodeOption = (
    nativeAudioNode: TNativeAudioNode,
    options: Partial<IAudioNodeOptions>,
    option: 'channelCount' | 'channelCountMode' | 'channelInterpretation'
) => {
    const value = options[option];

    if (value !== undefined && value !== nativeAudioNode[option]) {
        nativeAudioNode[option] = value;
    }
};

export const assignNativeAudioNodeOptions = (nativeAudioNode: TNativeAudioNode, options: Partial<IAudioNodeOptions> = { }): void => {
    assignNativeAudioNodeOption(nativeAudioNode, options, 'channelCount');
    assignNativeAudioNodeOption(nativeAudioNode, options, 'channelCountMode');
    assignNativeAudioNodeOption(nativeAudioNode, options, 'channelInterpretation');
};
