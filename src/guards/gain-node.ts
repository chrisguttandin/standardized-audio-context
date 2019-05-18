import { IAudioNode, IGainNode, IMinimalBaseAudioContext } from '../interfaces';

export const isGainNode = <T extends IMinimalBaseAudioContext>(audioNode: IAudioNode<T>): audioNode is IGainNode<T> => {
    return (!('frequency' in audioNode) && 'gain' in audioNode);
};
