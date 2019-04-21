import { IAudioNode, IGainNode, IMinimalBaseAudioContext } from '../interfaces';

export const isGainNode = <T extends IMinimalBaseAudioContext>(audioNode: IAudioNode<T>): audioNode is IGainNode<T> => {
    return (!audioNode.hasOwnProperty('frequency') && audioNode.hasOwnProperty('gain'));
};
