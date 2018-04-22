import { IAudioNode, IGainNode } from '../interfaces';

export const isGainNode = (audioNode: IAudioNode): audioNode is IGainNode => {
    return (!audioNode.hasOwnProperty('frequency') && audioNode.hasOwnProperty('gain'));
};
