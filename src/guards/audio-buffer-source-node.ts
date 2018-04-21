import { IAudioBufferSourceNode, IAudioNode } from '../interfaces';

export const isAudioBufferSourceNode = (audioNode: IAudioNode): audioNode is IAudioBufferSourceNode => {
    return ((<IAudioBufferSourceNode> audioNode).playbackRate !== undefined);
};
