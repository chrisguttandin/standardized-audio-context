import { IAudioNode, IOscillatorNode } from '../interfaces';

export const isOscillatorNode = (audioNode: IAudioNode): audioNode is IOscillatorNode => {
    return (audioNode.hasOwnProperty('detune') && audioNode.hasOwnProperty('frequency'));
};
