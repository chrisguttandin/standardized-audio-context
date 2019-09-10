import { ACTIVE_AUDIO_NODE_STORE } from '../globals';
import { IAudioNode, IMinimalBaseAudioContext } from '../interfaces';
import { getEventListenersOfAudioNode } from './get-event-listeners-of-audio-node';

export const setInternalStateToPassive = <T extends IMinimalBaseAudioContext>(audioNode: IAudioNode<T>) => {
    if (!ACTIVE_AUDIO_NODE_STORE.has(audioNode)) {
        throw new Error('The AudioNode is not stored.');
    }

    ACTIVE_AUDIO_NODE_STORE.delete(audioNode);

    getEventListenersOfAudioNode(audioNode)
        .forEach((eventListener) => eventListener('passive'));
};
