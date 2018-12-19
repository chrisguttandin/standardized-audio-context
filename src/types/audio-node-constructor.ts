import { IAudioNode, IAudioNodeRenderer } from '../interfaces';
import { TContext } from './context';
import { TNativeAudioNode } from './native-audio-node';

export type TAudioNodeConstructor = new (
    context: TContext,
    nativeAudioNode: TNativeAudioNode,
    audioNoderRenderer: null | IAudioNodeRenderer
) => IAudioNode;
