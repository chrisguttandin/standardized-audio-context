import { IAudioNode, IBiquadFilterNode } from '../interfaces';

export const isBiquadFilterNode = (audioNode: IAudioNode): audioNode is IBiquadFilterNode => {
    return ((<IBiquadFilterNode> audioNode).frequency !== undefined && (<IBiquadFilterNode> audioNode).gain !== undefined);
};
