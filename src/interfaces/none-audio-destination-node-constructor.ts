import { TNativeAudioNode } from '../types';
import { IAudioNode } from './audio-node';
import { IAudioNodeRenderer } from './audio-node-renderer';
import { IMinimalBaseAudioContext } from './minimal-base-audio-context';

export interface INoneAudioDestinationNodeConstructor {

    new (context: IMinimalBaseAudioContext, nativeNode: TNativeAudioNode, audioNoderRenderer: null | IAudioNodeRenderer): IAudioNode;

}
