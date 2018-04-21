import { IAudioNode, IOscillatorNode } from '../interfaces';

export const isOscillatorNode = (audioNode: IAudioNode): audioNode is IOscillatorNode => {
    return ((<IOscillatorNode> audioNode).detune !== undefined && (<IOscillatorNode> audioNode).frequency !== undefined);
};
