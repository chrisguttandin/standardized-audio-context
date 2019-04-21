import { IAudioNode, IBiquadFilterNode, IMinimalBaseAudioContext } from '../interfaces';

export const isBiquadFilterNode = <T extends IMinimalBaseAudioContext>(audioNode: IAudioNode<T>): audioNode is IBiquadFilterNode<T> => {
    return (audioNode.hasOwnProperty('frequency') && audioNode.hasOwnProperty('gain'));
};
