import { IAudioNode, IAudioNodeRenderer, IMinimalBaseAudioContext, IMinimalOfflineAudioContext } from '../interfaces';
import { TInternalState } from './internal-state';
import { TNativeAudioNode } from './native-audio-node';

export type TAudioNodeConstructor = new <T extends IMinimalBaseAudioContext>(
    context: T,
    internalState: TInternalState,
    nativeAudioNode: TNativeAudioNode,
    audioNodeRenderer: T extends IMinimalOfflineAudioContext ? IAudioNodeRenderer<T, IAudioNode<T>> : null
) => IAudioNode<T>;
