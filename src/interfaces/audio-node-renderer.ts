import { TNativeAudioNode, TUnpatchedOfflineAudioContext } from '../types';
import { IAudioNode } from './audio-node';

export interface IAudioNodeRenderer {

    render (proxy: IAudioNode, offlineAudioContext: TUnpatchedOfflineAudioContext): Promise<TNativeAudioNode>;

}
