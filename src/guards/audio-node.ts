import { IAudioNode, IAudioParam } from '../interfaces';

export const isAudioNode = (audioNodeOrAudioParam: IAudioNode | IAudioParam): audioNodeOrAudioParam is IAudioNode => {
    return ((<IAudioNode> audioNodeOrAudioParam).context !== undefined);
};
