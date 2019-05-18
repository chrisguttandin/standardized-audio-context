import { IAudioNode, IAudioWorkletNode, IMinimalBaseAudioContext } from '../interfaces';

export const isAudioWorkletNode = <T extends IMinimalBaseAudioContext>(audioNode: IAudioNode<T>): audioNode is IAudioWorkletNode<T> => {
    return 'port' in audioNode;
};
