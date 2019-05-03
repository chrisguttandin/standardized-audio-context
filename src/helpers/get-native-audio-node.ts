import { AUDIO_NODE_STORE } from '../globals';
import { IAudioNode, IMinimalBaseAudioContext, INativeAudioNodeFaker } from '../interfaces';
import { TNativeAudioNode } from '../types';
import { getValueForKey } from './get-value-for-key';

export const getNativeAudioNode = <T extends IMinimalBaseAudioContext, U extends TNativeAudioNode | INativeAudioNodeFaker>(
    audioNode: IAudioNode<T>
): U => {
    return <U> getValueForKey(AUDIO_NODE_STORE, audioNode);
};
