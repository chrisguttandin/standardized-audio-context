import { AUDIO_NODE_STATE_STORE } from '../globals';
import { IAudioNode, IMinimalBaseAudioContext } from '../interfaces';
import { TInternalState } from '../types';
import { getEventListenersOfAudioNode } from './get-event-listeners-of-audio-node';

export const setInternalState = <T extends IMinimalBaseAudioContext>(audioNode: IAudioNode<T>, state: TInternalState) => {
    AUDIO_NODE_STATE_STORE.set(audioNode, state);

    getEventListenersOfAudioNode(audioNode)
        .forEach((eventListener) => eventListener(state));
};
