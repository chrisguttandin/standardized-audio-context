import { IAudioBufferSourceNode, IAudioNode, IMinimalBaseAudioContext } from '../interfaces';

export const isAudioBufferSourceNode = <T extends IMinimalBaseAudioContext>(
    audioNode: IAudioNode<T>
): audioNode is IAudioBufferSourceNode<T> => {
    return 'playbackRate' in audioNode;
};
