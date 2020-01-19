import { EVENT_LISTENERS } from '../globals';
import { IAudioNode } from '../interfaces';
import { TContext, TInternalStateEventListener } from '../types';
import { getValueForKey } from './get-value-for-key';

export const getEventListenersOfAudioNode = <T extends TContext>(audioNode: IAudioNode<T>): Set<TInternalStateEventListener> => {
    return getValueForKey(EVENT_LISTENERS, audioNode);
};
