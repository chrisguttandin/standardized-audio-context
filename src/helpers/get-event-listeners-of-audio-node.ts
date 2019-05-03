import { EVENT_LISTENERS } from '../globals';
import { IAudioNode, IMinimalBaseAudioContext } from '../interfaces';
import { TInternalStateEventListener } from '../types';
import { getValueForKey } from './get-value-for-key';

export const getEventListenersOfAudioNode = <T extends IMinimalBaseAudioContext>(
    audioNode: IAudioNode<T>
): Set<TInternalStateEventListener> => {
    return getValueForKey(EVENT_LISTENERS, audioNode);
};
