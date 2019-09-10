import { AUDIO_NODE_CONNECTIONS_STORE } from '../globals';
import { IAudioNode, IMinimalBaseAudioContext } from '../interfaces';
import { TAudioNodeConnections, TGetAudioNodeConnectionsFunction } from '../types';
import { getValueForKey } from './get-value-for-key';

export const getAudioNodeConnections: TGetAudioNodeConnectionsFunction = <T extends IMinimalBaseAudioContext> (
    audioNode: IAudioNode<T>
): TAudioNodeConnections<T> => {
    return <TAudioNodeConnections<T>> getValueForKey(AUDIO_NODE_CONNECTIONS_STORE, audioNode);
};
