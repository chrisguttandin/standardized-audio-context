import { IAudioNode, IAudioNodeRenderer, IMinimalBaseAudioContext, IMinimalOfflineAudioContext } from '../interfaces';
import { TNativeAudioNode } from './native-audio-node';

export type TAddAudioNodeConnectionsFunction = <T extends IMinimalBaseAudioContext>(
    audioNode: IAudioNode<T>,
    audioNoderRender: T extends IMinimalOfflineAudioContext ? IAudioNodeRenderer<T, IAudioNode<T>> : null,
    nativeAudioNode: TNativeAudioNode
) => void;
