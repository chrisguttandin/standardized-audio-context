import { TNativeAudioNode, TStandardizedContext } from '../types';
import { IAudioNode } from './audio-node';
import { IAudioNodeRenderer } from './audio-node-renderer';

export interface INoneAudioDestinationNodeConstructor {

    new (context: TStandardizedContext, nativeAudioNode: TNativeAudioNode, audioNoderRenderer: null | IAudioNodeRenderer): IAudioNode;

}
