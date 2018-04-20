import { TContext, TNativeAudioNode } from '../types';
import { IAudioNode } from './audio-node';
import { IAudioNodeRenderer } from './audio-node-renderer';

export interface IAudioNodeConstructor {

    new (context: TContext, nativeAudioNode: TNativeAudioNode, audioNoderRenderer: null | IAudioNodeRenderer): IAudioNode;

}
