import { ACTIVE_AUDIO_NODE_STORE } from '../globals';
import { IAudioNode, IMinimalBaseAudioContext } from '../interfaces';
import { TInternalState } from '../types';
import { getEventListenersOfAudioNode } from './get-event-listeners-of-audio-node';

export const setInternalState = <T extends IMinimalBaseAudioContext>(audioNode: IAudioNode<T>, internalState: TInternalState) => {
    if (internalState === 'active') {
        if (ACTIVE_AUDIO_NODE_STORE.has(audioNode)) {
            throw new Error('The AudioNode is already stored.');
        }

        ACTIVE_AUDIO_NODE_STORE.add(audioNode);
    } else {
        if (!ACTIVE_AUDIO_NODE_STORE.has(audioNode)) {
            throw new Error('The AudioNode is not stored.');
        }

        ACTIVE_AUDIO_NODE_STORE.delete(audioNode);
    }

    getEventListenersOfAudioNode(audioNode)
        .forEach((eventListener) => eventListener(internalState));
};
