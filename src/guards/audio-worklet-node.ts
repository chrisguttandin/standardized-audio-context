import { IAudioNode, IAudioWorkletNode } from '../interfaces';

export const isAudioWorkletNode = (audioNode: IAudioNode): audioNode is IAudioWorkletNode => {
    return audioNode.hasOwnProperty('port');
};
