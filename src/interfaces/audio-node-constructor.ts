import { TNativeAudioNode, TStandardizedContext } from '../types';
import { IAudioNode } from './audio-node';
import { IAudioNodeRenderer } from './audio-node-renderer';

export interface IAudioNodeConstructor {

    new (context: TStandardizedContext, nativeNode: TNativeAudioNode, audioNoderRenderer: null | IAudioNodeRenderer): IAudioNode;

}
