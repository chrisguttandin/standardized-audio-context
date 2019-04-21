import { IAudioNode, IAudioParam, IMinimalBaseAudioContext } from '../interfaces';

export const isAudioNode = <T extends IMinimalBaseAudioContext>(
    audioNodeOrAudioParam: IAudioNode<T> | IAudioParam
): audioNodeOrAudioParam is IAudioNode<T> => {
    return ((<IAudioNode<T>> audioNodeOrAudioParam).context !== undefined);
};
