import { IAudioNode, IConstantSourceNode } from '../interfaces';

export const isConstantSourceNode = (audioNode: IAudioNode): audioNode is IConstantSourceNode => {
    return ((<IConstantSourceNode> audioNode).offset !== undefined);
};
