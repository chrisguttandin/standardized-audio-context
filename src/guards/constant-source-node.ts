import { IAudioNode, IConstantSourceNode, IMinimalBaseAudioContext } from '../interfaces';

export const isConstantSourceNode = <T extends IMinimalBaseAudioContext>(audioNode: IAudioNode<T>): audioNode is IConstantSourceNode<T> => {
    return 'offset' in audioNode;
};
