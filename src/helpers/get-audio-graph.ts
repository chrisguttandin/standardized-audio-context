import { AUDIO_GRAPHS } from '../globals';
import { IAudioGraph, IMinimalBaseAudioContext } from '../interfaces';
import { TNativeAudioContext, TNativeOfflineAudioContext } from '../types';

export const getAudioGraph = (anyContext: IMinimalBaseAudioContext | TNativeAudioContext | TNativeOfflineAudioContext): IAudioGraph => {
    const audioGraph = AUDIO_GRAPHS.get(anyContext);

    if (audioGraph === undefined) {
        throw new Error('Missing the audio graph of the given context.');
    }

    return audioGraph;
};
