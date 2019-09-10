import { AUDIO_PARAM_CONNECTIONS_STORE } from '../globals';
import { IAudioParam, IMinimalBaseAudioContext } from '../interfaces';
import { TAudioParamConnections } from '../types';
import { getValueForKey } from './get-value-for-key';

export function getAudioParamConnections <T extends IMinimalBaseAudioContext> (audioParam: IAudioParam): TAudioParamConnections<T> {
    return <TAudioParamConnections<T>> getValueForKey(AUDIO_PARAM_CONNECTIONS_STORE, audioParam);
}
