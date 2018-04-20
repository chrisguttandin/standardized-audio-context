import { AUDIO_NODE_STORE } from '../globals';
import { IAudioNode, INativeAudioNodeFaker } from '../interfaces';
import { TNativeAudioNode } from '../types';

export const getNativeAudioNode = <T extends TNativeAudioNode | INativeAudioNodeFaker>(audioNode: IAudioNode): T => {
    const nativeAudioNode = AUDIO_NODE_STORE.get(audioNode);

    if (nativeAudioNode === undefined) {
        throw new Error('The associated nativeAudioNode is missing.');
    }

    return <T> nativeAudioNode;
};
