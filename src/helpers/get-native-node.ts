import { AUDIO_NODE_STORE } from '../globals';
import { IAudioNode } from '../interfaces';

export const getNativeNode = (audioNode: IAudioNode) => {
    const nativeNode = AUDIO_NODE_STORE.get(audioNode);

    if (nativeNode === undefined) {
        throw new Error('The associated nativeNode is missing.');
    }

    return nativeNode;
};
