import { IAudioNode, IBiquadFilterNode } from '../interfaces';

export const isBiquadFilterNode = (audioNode: IAudioNode): audioNode is IBiquadFilterNode => {
    return (audioNode.hasOwnProperty('frequency') && audioNode.hasOwnProperty('gain'));
};
