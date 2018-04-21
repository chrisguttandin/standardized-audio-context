import { IAudioNode, IBiquadFilterNode, IGainNode } from '../interfaces';

export const isGainNode = (audioNode: IAudioNode): audioNode is IGainNode => {
    return ((<IBiquadFilterNode> audioNode).frequency === undefined && (<IGainNode> audioNode).gain !== undefined);
};
