import { AUDIO_PARAM_CONNECTIONS_STORE } from '../globals';
import { IAudioParam, IAudioParamConnections, IMinimalBaseAudioContext } from '../interfaces';
import { getValueForKey } from './get-value-for-key';

export function getAudioParamConnections <T extends IMinimalBaseAudioContext> (audioParam: IAudioParam): IAudioParamConnections<T> {
    return <IAudioParamConnections<T>> getValueForKey(AUDIO_PARAM_CONNECTIONS_STORE, audioParam);
}
