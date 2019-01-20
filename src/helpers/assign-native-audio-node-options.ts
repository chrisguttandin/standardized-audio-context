import { IAudioNodeOptions } from '../interfaces';
import { TNativeAudioNode } from '../types';
import { assignNativeAudioNodeOption } from './assign-native-audio-node-option';

export const assignNativeAudioNodeOptions = (nativeAudioNode: TNativeAudioNode, options: Partial<IAudioNodeOptions>): void => {
    assignNativeAudioNodeOption(nativeAudioNode, options, 'channelCount');
    assignNativeAudioNodeOption(nativeAudioNode, options, 'channelCountMode');
    assignNativeAudioNodeOption(nativeAudioNode, options, 'channelInterpretation');
};
