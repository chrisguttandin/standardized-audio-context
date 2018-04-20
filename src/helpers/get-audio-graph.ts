import { AUDIO_GRAPHS } from '../globals';
import { IAudioGraph } from '../interfaces';
import { TNativeContext, TStandardizedContext } from '../types';

export function getAudioGraph (anyContext: TNativeContext | TStandardizedContext): IAudioGraph {
    const audioGraph = AUDIO_GRAPHS.get(anyContext);

    if (audioGraph === undefined) {
        throw new Error('Missing the audio graph of the given context.');
    }

    return audioGraph;
}
