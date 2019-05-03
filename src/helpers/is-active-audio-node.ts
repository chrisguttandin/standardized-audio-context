import { ACTIVE_AUDIO_NODE_STORE } from '../globals';
import { IAudioNode, IMinimalBaseAudioContext } from '../interfaces';

export const isActiveAudioNode = <T extends IMinimalBaseAudioContext>(audioNode: IAudioNode<T>): boolean => {
    return ACTIVE_AUDIO_NODE_STORE.has(audioNode);
};
