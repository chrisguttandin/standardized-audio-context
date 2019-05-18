import { IAudioNode, IDelayNode, IMinimalBaseAudioContext } from '../interfaces';

export const isDelayNode = <T extends IMinimalBaseAudioContext>(audioNode: IAudioNode<T>): audioNode is IDelayNode<T> => {
    return 'delayTime' in audioNode;
};
