import { AUDIO_NODE_CONNECTIONS_STORE } from '../globals';
import { IAudioNode, IAudioNodeConnections, IMinimalBaseAudioContext } from '../interfaces';
import { TGetAudioNodeConnectionsFunction } from '../types';
import { getValueForKey } from './get-value-for-key';

export const getAudioNodeConnections: TGetAudioNodeConnectionsFunction = <T extends IMinimalBaseAudioContext> (
    audioNode: IAudioNode<T>
): IAudioNodeConnections<T> => {
    return <IAudioNodeConnections<T>> getValueForKey(AUDIO_NODE_CONNECTIONS_STORE, audioNode);
};
