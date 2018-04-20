import { TNativeAudioNode, TNativeOfflineAudioContext } from '../types';
import { IAudioNode } from './audio-node';

export interface IAudioNodeRenderer {

    render (proxy: IAudioNode, nativeOfflineAudioContext: TNativeOfflineAudioContext): Promise<TNativeAudioNode>;

}
