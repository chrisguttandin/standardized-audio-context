import { AUDIO_GRAPHS } from '../globals';
import { IAudioGraph, IMinimalBaseAudioContext } from '../interfaces';
import { getValueForKey } from './get-value-for-key';

export function getAudioGraph <T extends IMinimalBaseAudioContext> (context: T): IAudioGraph<T> {
    return <IAudioGraph<T>> getValueForKey(AUDIO_GRAPHS, context);
}
