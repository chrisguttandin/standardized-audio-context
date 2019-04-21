import { AUDIO_GRAPHS } from '../globals';
import { IAudioGraph, IMinimalBaseAudioContext } from '../interfaces';
import { TAnyContext } from '../types';

export function getAudioGraph <T extends IMinimalBaseAudioContext> (anyContext: TAnyContext): IAudioGraph<T> {
    const audioGraph = AUDIO_GRAPHS.get(anyContext);

    if (audioGraph === undefined) {
        throw new Error('Missing the audio graph of the given context.');
    }

    return <IAudioGraph<T>> audioGraph;
}
