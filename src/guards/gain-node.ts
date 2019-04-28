import { IAudioNode, IBiquadFilterNode, IGainNode, IMinimalBaseAudioContext, IOscillatorNode } from '../interfaces';

export const isGainNode = <T extends IMinimalBaseAudioContext>(audioNode: IAudioNode<T>): audioNode is IGainNode<T> => {
    return ((<IBiquadFilterNode<T> | IOscillatorNode<T>> audioNode).frequency === undefined
        && (<IBiquadFilterNode<T> | IGainNode<T>> audioNode).gain !== undefined);
};
