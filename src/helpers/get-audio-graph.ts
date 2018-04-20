import { AUDIO_GRAPHS } from '../globals';
import { IAudioGraph } from '../interfaces';
import { TContext, TNativeContext } from '../types';

export function getAudioGraph (anyContext: TContext | TNativeContext): IAudioGraph {
    const audioGraph = AUDIO_GRAPHS.get(anyContext);

    if (audioGraph === undefined) {
        throw new Error('Missing the audio graph of the given context.');
    }

    return audioGraph;
}
