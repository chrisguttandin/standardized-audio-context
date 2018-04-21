import { IAudioNode, IAudioWorkletNode } from '../interfaces';

export const isAudioWorkletNode = (audioNode: IAudioNode): audioNode is IAudioWorkletNode => {
    return ((<IAudioWorkletNode> audioNode).port !== undefined);
};
