import { AUDIO_NODE_STORE } from '../globals';
import { IAudioNode, INativeAudioNodeFaker } from '../interfaces';
import { TNativeAudioNode } from '../types';

export const getNativeNode = (audioNode: IAudioNode): TNativeAudioNode | INativeAudioNodeFaker => {
    const nativeNode = AUDIO_NODE_STORE.get(audioNode);

    if (nativeNode === undefined) {
        throw new Error('The associated nativeNode is missing.');
    }

    return nativeNode;
};
