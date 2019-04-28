import { IAudioNode, IBiquadFilterNode, IMinimalBaseAudioContext, IOscillatorNode } from '../interfaces';

export const isOscillatorNode = <T extends IMinimalBaseAudioContext>(audioNode: IAudioNode<T>): audioNode is IOscillatorNode<T> => {
    // Bug #149: Safari does not yet support the detune AudioParam.
    return ((</* IAudioBufferSourceNode <T> | */IOscillatorNode<T>> audioNode).detune !== undefined
        && (<IBiquadFilterNode<T> | IOscillatorNode<T>> audioNode).frequency !== undefined);
};
