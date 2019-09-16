import { AUDIO_PARAM_CONNECTIONS_STORE } from '../globals';
import { IAudioParam, IMinimalBaseAudioContext } from '../interfaces';
import { TAudioParamConnections, TGetAudioParamConnectionsFunction } from '../types';
import { getValueForKey } from './get-value-for-key';

export const getAudioParamConnections: TGetAudioParamConnectionsFunction = <T extends IMinimalBaseAudioContext>(
    audioParam: IAudioParam
): TAudioParamConnections<T> => {
    return <TAudioParamConnections<T>> getValueForKey(AUDIO_PARAM_CONNECTIONS_STORE, audioParam);
};
