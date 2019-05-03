import { IAudioNode, IMinimalBaseAudioContext } from '../interfaces';
import { TInternalStateEventListener } from '../types';
import { getEventListenersOfAudioNode } from './get-event-listeners-of-audio-node';

export const deleteEventListenerOfAudioNode = <T extends IMinimalBaseAudioContext>(
    audioNode: IAudioNode<T>,
    eventListener: TInternalStateEventListener
) => {
    const eventListeners = getEventListenersOfAudioNode(audioNode);

    if (!eventListeners.delete(eventListener)) {
        throw new Error('Missing the expected event listener');
    }
};
