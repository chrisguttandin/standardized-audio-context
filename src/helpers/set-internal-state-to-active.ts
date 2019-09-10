import { ACTIVE_AUDIO_NODE_STORE } from '../globals';
import { IAudioNode, IMinimalBaseAudioContext } from '../interfaces';
import { getEventListenersOfAudioNode } from './get-event-listeners-of-audio-node';

export const setInternalStateToActive = <T extends IMinimalBaseAudioContext>(audioNode: IAudioNode<T>) => {
    if (ACTIVE_AUDIO_NODE_STORE.has(audioNode)) {
        throw new Error('The AudioNode is already stored.');
    }

    ACTIVE_AUDIO_NODE_STORE.add(audioNode);

    getEventListenersOfAudioNode(audioNode)
        .forEach((eventListener) => eventListener('active'));
};
