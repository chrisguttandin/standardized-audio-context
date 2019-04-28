import { IAudioNode, IBiquadFilterNode, IGainNode, IMinimalBaseAudioContext, IOscillatorNode } from '../interfaces';

export const isBiquadFilterNode = <T extends IMinimalBaseAudioContext>(audioNode: IAudioNode<T>): audioNode is IBiquadFilterNode<T> => {
    return ((<IBiquadFilterNode<T> | IOscillatorNode<T>> audioNode).frequency !== undefined
        && (<IBiquadFilterNode<T> | IGainNode<T>> audioNode).gain !== undefined);
};
