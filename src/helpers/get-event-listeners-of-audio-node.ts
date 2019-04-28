import { EVENT_LISTENERS } from '../globals';
import { IAudioNode, IMinimalBaseAudioContext } from '../interfaces';
import { TInternalStateEventListener } from '../types';

export const getEventListenersOfAudioNode = <T extends IMinimalBaseAudioContext>(
    audioNode: IAudioNode<T>
): Set<TInternalStateEventListener> => {
    const eventListeners = EVENT_LISTENERS.get(audioNode);

    if (eventListeners === undefined) {
        throw new Error('The associated event listeners is missing.');
    }

    return eventListeners;
};
