import { IAudioNode, IMinimalBaseAudioContext, IOscillatorNode } from '../interfaces';

export const isOscillatorNode = <T extends IMinimalBaseAudioContext>(audioNode: IAudioNode<T>): audioNode is IOscillatorNode<T> => {
    return (audioNode.hasOwnProperty('detune') && audioNode.hasOwnProperty('frequency'));
};
