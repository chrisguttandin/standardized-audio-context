import { IAudioNode, IAudioNodeRenderer, IMinimalBaseAudioContext, IMinimalOfflineAudioContext } from '../interfaces';
import { TNativeAudioNode } from './native-audio-node';

export type TAudioNodeConstructor = new <T extends IMinimalBaseAudioContext>(
    context: T,
    nativeAudioNode: TNativeAudioNode,
    audioNodeRenderer: T extends IMinimalOfflineAudioContext ? IAudioNodeRenderer<T, IAudioNode<T>> : null
) => IAudioNode<T>;
