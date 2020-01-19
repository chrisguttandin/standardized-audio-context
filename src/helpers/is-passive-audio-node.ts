import { ACTIVE_AUDIO_NODE_STORE } from '../globals';
import { IAudioNode } from '../interfaces';
import { TContext } from '../types';

export const isPassiveAudioNode = <T extends TContext>(audioNode: IAudioNode<T>): boolean => {
    return !ACTIVE_AUDIO_NODE_STORE.has(audioNode);
};
